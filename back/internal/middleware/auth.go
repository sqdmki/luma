package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"luma/internal/logger"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type contextKey string

const (
	UserIDKey   contextKey = "userID"
	UserRoleKey contextKey = "userRole"
)

// AuthMiddleware extracts JWT token and adds user info to context
func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			// No token, proceed as guest
			return next(c)
		}

		// Check format "Bearer <token>"
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid authorization header format")
		}
		tokenString := parts[1]

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			logger.Log.Error("JWT_SECRET environment variable is not set")
			return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error")
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		})

		if err != nil {
			// Log specific error for debugging but return generic 401
			logger.Log.Debug("JWT Parse Error", zap.Error(err))
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid or expired token")
		}

		if !token.Valid {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid token")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid token claims")
		}

		userID, ok := claims["user_id"].(string)
		if !ok {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid user ID in token")
		}
		
		role, _ := claims["role"].(string)

		// Add to Echo context (for REST handlers if any)
		c.Set("userID", userID)
		c.Set("userRole", role)

		// Add to request context (for GraphQL)
		ctx := context.WithValue(c.Request().Context(), UserIDKey, userID)
		ctx = context.WithValue(ctx, UserRoleKey, role)
		c.SetRequest(c.Request().WithContext(ctx))

		return next(c)
	}
}

// GetUserIDFromContext retrieves user ID from context
func GetUserIDFromContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(UserIDKey).(string)
	return userID, ok
}

// GetUserRoleFromContext retrieves user Role from context
func GetUserRoleFromContext(ctx context.Context) (string, bool) {
	role, ok := ctx.Value(UserRoleKey).(string)
	return role, ok
}
