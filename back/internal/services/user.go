package services

import (
	"errors"
	"luma/internal/database"
	"luma/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserService struct{}

func (s *UserService) GetUser(id string) (*models.User, error) {
	var user models.User
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	if err := database.DB.First(&user, "id = ?", uid).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // User not found
		}
		return nil, err
	}
	return &user, nil
}

func (s *UserService) GetUserCollection(userID string, limit, offset int) ([]models.Track, error) {
	var tracks []models.Track
	err := database.DB.Table("tracks").
		Joins("JOIN user_tracks ON user_tracks.track_id = tracks.id").
		Where("user_tracks.user_id = ?", userID).
		Preload("Artist").Preload("Tags").
		Limit(limit).Offset(offset).
		Order("user_tracks.added_at desc").
		Find(&tracks).Error
	return tracks, err
}

func (s *UserService) GetFollowedArtists(userID string) ([]models.User, error) {
	var artists []models.User
	err := database.DB.Table("users").
		Joins("JOIN user_followings ON user_followings.artist_id = users.id").
		Where("user_followings.follower_id = ?", userID).
		Order("user_followings.followed_at desc").
		Find(&artists).Error
	return artists, err
}
