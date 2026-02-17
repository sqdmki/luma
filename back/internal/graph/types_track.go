package graph

import (
	"luma/internal/models"
	"luma/internal/services"

	"github.com/graph-gophers/graphql-go"
)

// TrackResolver resolves the Track type
type TrackResolver struct {
	t           *models.Track
	userService *services.UserService
}

func (r *TrackResolver) ID() graphql.ID {
	return graphql.ID(r.t.ID.String())
}

func (r *TrackResolver) Title() string {
	return r.t.Title
}

func (r *TrackResolver) Artist() *UserResolver {
	// Pass userService to nested UserResolver so we can query artist's collections too if needed
	return &UserResolver{u: &r.t.Artist, userService: r.userService}
}

func (r *TrackResolver) FileUrl() string {
	return r.t.FileURL
}

func (r *TrackResolver) CoverUrl() *string {
	return r.t.CoverURL
}

func (r *TrackResolver) Genre() string {
	return r.t.Genre
}

func (r *TrackResolver) Duration() int32 {
	return int32(r.t.Duration)
}

func (r *TrackResolver) PlayCount() int32 {
	return int32(r.t.PlayCount)
}

func (r *TrackResolver) CreatedAt() string {
	return r.t.CreatedAt.String()
}

func (r *TrackResolver) Tags() []string {
	var tags []string
	for _, t := range r.t.Tags {
		tags = append(tags, t.Name)
	}
	return tags
}
