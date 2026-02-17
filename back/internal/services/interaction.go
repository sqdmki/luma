package services

import (
	"errors"
	"luma/internal/database"
	"luma/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type InteractionService struct{}

func (s *InteractionService) FollowArtist(followerID, artistID string) error {
	fid, _ := uuid.Parse(followerID)
	aid, _ := uuid.Parse(artistID)

	follow := models.UserFollowing{
		FollowerID: fid,
		ArtistID:   aid,
	}
	return database.DB.Create(&follow).Error
}

func (s *InteractionService) UnfollowArtist(followerID, artistID string) error {
	return database.DB.Delete(&models.UserFollowing{}, "follower_id = ? AND artist_id = ?", followerID, artistID).Error
}

func (s *InteractionService) RecordInterest(userID, tag string, score float64) error {
	uid, _ := uuid.Parse(userID)
	
	var interest models.UserInterest
	err := database.DB.Where("user_id = ? AND tag = ?", uid, tag).First(&interest).Error
	
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			interest = models.UserInterest{
				UserID: uid,
				Tag:    tag,
				Score:  score,
			}
			return database.DB.Create(&interest).Error
		}
		return err
	}
	
	interest.Score += score
	return database.DB.Save(&interest).Error
}
