package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Base model with UUID
type Base struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

// User represents a registered user or an artist
type User struct {
	Base
	Email        string  `gorm:"uniqueIndex;not null"`
	PasswordHash string  `gorm:"not null"`
	DisplayName  string  `gorm:"size:255"`
	AvatarURL    *string `gorm:"size:512"`
	Role         string  `gorm:"default:'user'"` // user, artist, admin
	Bio          *string `gorm:"type:text"`
	IsVerified   bool    `gorm:"default:false"`

	// Relationships
	PublishedTracks []Track         `gorm:"foreignKey:ArtistID"`
	Collection      []UserTrack     `gorm:"foreignKey:UserID"`
	FollowedArtists []UserFollowing `gorm:"foreignKey:FollowerID"`
	Interests       []UserInterest  `gorm:"foreignKey:UserID"`
}

// Session stores active sessions (refresh tokens) for distribution
type Session struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID       uuid.UUID `gorm:"type:uuid;not null;index"`
	RefreshToken string    `gorm:"uniqueIndex;not null"`
	UserAgent    string
	IPAddress    string
	ExpiresAt    time.Time `gorm:"index"`
	CreatedAt    time.Time
}

// Track represents a music file
type Track struct {
	Base
	Title     string    `gorm:"not null;index"`
	ArtistID  uuid.UUID `gorm:"type:uuid;not null;index"`
	Artist    User      `gorm:"foreignKey:ArtistID"`
	Duration  int       // in seconds
	FileURL   string    `gorm:"not null"`
	CoverURL  *string
	Genre     string    `gorm:"index"`
	PlayCount int64     `gorm:"default:0"`

	// Tags for interests (e.g., "rock", "lo-fi", "party")
	Tags []Tag `gorm:"many2many:track_tags;"`
}

type Tag struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"uniqueIndex"`
}

// UserTrack handles the "Collection" logic (Many-to-Many with metadata)
type UserTrack struct {
	UserID    uuid.UUID `gorm:"type:uuid;primaryKey"`
	TrackID   uuid.UUID `gorm:"type:uuid;primaryKey"`
	AddedAt   time.Time `gorm:"default:now()"`
	IsLiked   bool      `gorm:"default:true"` // Used for "Likes"
	PlayCount int       `gorm:"default:0"`    // Personal play count
}

// UserFollowing handles "Follow Authors" logic
type UserFollowing struct {
	FollowerID uuid.UUID `gorm:"type:uuid;primaryKey"`
	ArtistID   uuid.UUID `gorm:"type:uuid;primaryKey"`
	FollowedAt time.Time `gorm:"default:now()"`
}

// UserInterest tracks what a user likes based on tags/genres
type UserInterest struct {
	UserID    uuid.UUID `gorm:"type:uuid;primaryKey"`
	Tag       string    `gorm:"primaryKey;index"` // Simplified: stored as string to avoid complex joins on high-load read
	Score     float64   `gorm:"default:0"`        // e.g. +1 for listen, +5 for like
	UpdatedAt time.Time
}
