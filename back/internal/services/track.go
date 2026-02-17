package services

import (
	"errors"
	"luma/internal/database"
	"luma/internal/models"

	"github.com/google/uuid"
)

type TrackService struct{}

type CreateTrackInput struct {
	Title    string
	FileUrl  string 
	CoverUrl *string
	Genre    string
	Tags     []string
	Duration int32
}

func (s *TrackService) CreateTrack(userID string, input CreateTrackInput) (*models.Track, error) {
	artistID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	track := models.Track{
		Title:    input.Title,
		ArtistID: artistID,
		FileURL:  input.FileUrl,
		CoverURL: input.CoverUrl,
		Genre:    input.Genre,
		Duration: int(input.Duration),
	}

	// Handle Tags
	var tags []models.Tag
	for _, tagName := range input.Tags {
		var tag models.Tag
		if err := database.DB.FirstOrCreate(&tag, models.Tag{Name: tagName}).Error; err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}
	track.Tags = tags

	if err := database.DB.Create(&track).Error; err != nil {
		return nil, err
	}
	
	database.DB.Preload("Artist").First(&track, track.ID)

	return &track, nil
}

func (s *TrackService) DeleteTrack(userID string, trackID string) error {
	var track models.Track
	if err := database.DB.First(&track, "id = ?", trackID).Error; err != nil {
		return errors.New("track not found")
	}

	if track.ArtistID.String() != userID {
		return errors.New("unauthorized: you can only delete your own tracks")
	}

	return database.DB.Delete(&track).Error
}

func (s *TrackService) GetTracks(limit, offset int) ([]models.Track, error) {
	var tracks []models.Track
	err := database.DB.Preload("Artist").Preload("Tags").Limit(limit).Offset(offset).Order("created_at desc").Find(&tracks).Error
	return tracks, err
}

func (s *TrackService) GetTrack(id string) (*models.Track, error) {
	var track models.Track
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, errors.New("invalid track id")
	}
	err = database.DB.Preload("Artist").Preload("Tags").First(&track, "id = ?", uid).Error
	if err != nil {
		return nil, err
	}
	return &track, nil
}

func (s *TrackService) AddToCollection(userID, trackID string) error {
	uid, _ := uuid.Parse(userID)
	tid, _ := uuid.Parse(trackID)

	userTrack := models.UserTrack{
		UserID:  uid,
		TrackID: tid,
		IsLiked: true,
	}
	return database.DB.Save(&userTrack).Error
}

func (s *TrackService) RemoveFromCollection(userID, trackID string) error {
	return database.DB.Delete(&models.UserTrack{}, "user_id = ? AND track_id = ?", userID, trackID).Error
}
