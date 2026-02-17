package services

import (
	"errors"
	"time"
	"os"

	"luma/internal/database"
	"luma/internal/logger"
	"luma/internal/models"
	"luma/internal/utils"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type AuthService struct{}

type RegisterInput struct {
	Email       string
	Password    string
	DisplayName string
}

type LoginInput struct {
	Email    string
	Password string
}

type AuthResponse struct {
	Token        string
	RefreshToken string
	User         models.User
}

func (s *AuthService) Register(input RegisterInput) (*models.User, error) {
	// Optimization: Use separate struct for check to avoid loading full User model
	var exists bool
	// Use raw SQL exists check for speed
	err := database.DB.Model(&models.User{}).
		Select("count(*) > 0").
		Where("email = ?", input.Email).
		Find(&exists).Error

	if err == nil && exists {
		return nil, errors.New("email already registered")
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		logger.Log.Error("Failed to hash password", zap.Error(err))
		return nil, errors.New("internal server error")
	}

	user := models.User{
		Email:        input.Email,
		PasswordHash: hashedPassword,
		DisplayName:  input.DisplayName,
		Role:         "user",
	}

	if err := database.DB.Create(&user).Error; err != nil {
		logger.Log.Error("Failed to create user", zap.Error(err))
		return nil, errors.New("failed to create user")
	}

	return &user, nil
}

func (s *AuthService) Login(input LoginInput) (*AuthResponse, error) {
	var user models.User
	// Select only needed fields for login first
	if err := database.DB.Select("id, role, password_hash, email, display_name").Where("email = ?", input.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logger.Log.Warn("Login failed: User not found", zap.String("email", input.Email))
			// Timing attack mitigation: simulate verify work (not perfect but better)
			// But Argon2 is slow, so hard to fake exactly. Best effort is generic error.
			return nil, errors.New("invalid credentials")
		}
		return nil, err
	}

	match, err := utils.VerifyPassword(input.Password, user.PasswordHash)
	if err != nil {
		logger.Log.Error("Password verification error", zap.Error(err))
		return nil, errors.New("internal error")
	}

	if !match {
		logger.Log.Warn("Login failed: Invalid password", 
			zap.String("email", input.Email),
			zap.String("user_id", user.ID.String()),
		)
		return nil, errors.New("invalid credentials")
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return nil, errors.New("server configuration error")
	}

	// Create Access Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.String(),
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
		"iat":     time.Now().Unix(), // Issued At
		"iss":     "luma-api",        // Issuer
	})
	
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return nil, err
	}

	// Create Refresh Token
	// Using random UUID is okay, but consider signing it too or simply keep as opaque string in DB
	refreshToken := uuid.New().String()
	
	// Store Session with minimal data overhead
	// In high load, consider storing sessions in Redis instead of Postgres
	// But Postgres is fine for persistent sessions.
	session := models.Session{
		UserID:       user.ID,
		RefreshToken: refreshToken,
		UserAgent:    "unknown", 
		IPAddress:    "unknown",
		ExpiresAt:    time.Now().Add(time.Hour * 24 * 7), 
	}

	if err := database.DB.Create(&session).Error; err != nil {
		return nil, err
	}

	// Fetch full user for response if needed (or assume the partial select above is enough)
	// We selected enough fields for the UI usually.

	return &AuthResponse{
		Token:        tokenString,
		RefreshToken: refreshToken,
		User:         user,
	}, nil
}
