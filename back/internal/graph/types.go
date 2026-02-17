package graph

import (
	"luma/internal/models"
	"luma/internal/services"

	"github.com/graph-gophers/graphql-go"
)

// UserResolver resolves the User type
type UserResolver struct {
	u           *models.User
	userService *services.UserService
}

func (r *UserResolver) ID() graphql.ID {
	return graphql.ID(r.u.ID.String())
}

func (r *UserResolver) Email() string {
	return r.u.Email
}

func (r *UserResolver) DisplayName() string {
	return r.u.DisplayName
}

func (r *UserResolver) AvatarUrl() *string { 
	return r.u.AvatarURL
}

func (r *UserResolver) Role() string {
	return r.u.Role
}

func (r *UserResolver) IsVerified() bool {
	return r.u.IsVerified
}

func (r *UserResolver) CreatedAt() string {
	return r.u.CreatedAt.String()
}

type CollectionArgs struct {
	Limit  *int32
	Offset *int32
}

func (r *UserResolver) Collection(args CollectionArgs) ([]*TrackResolver, error) {
	if r.userService == nil {
		return []*TrackResolver{}, nil
	}
	
	limit := 10
	if args.Limit != nil {
		limit = int(*args.Limit)
	}
	offset := 0
	if args.Offset != nil {
		offset = int(*args.Offset)
	}

	tracks, err := r.userService.GetUserCollection(r.u.ID.String(), limit, offset)
	if err != nil {
		return nil, err
	}

	var resolvers []*TrackResolver
	for i := range tracks {
		resolvers = append(resolvers, &TrackResolver{t: &tracks[i], userService: r.userService})
	}
	return resolvers, nil
}

func (r *UserResolver) FollowedArtists() ([]*UserResolver, error) {
	if r.userService == nil {
		return []*UserResolver{}, nil
	}

	artists, err := r.userService.GetFollowedArtists(r.u.ID.String())
	if err != nil {
		return nil, err
	}

	var resolvers []*UserResolver
	for i := range artists {
		resolvers = append(resolvers, &UserResolver{u: &artists[i], userService: r.userService})
	}
	return resolvers, nil
}

// AuthResponseResolver resolves the AuthResponse type
type AuthResponseResolver struct {
	token        string
	refreshToken string
	user         *models.User
	userService  *services.UserService
}

func (r *AuthResponseResolver) Token() string {
	return r.token
}

func (r *AuthResponseResolver) RefreshToken() string {
	return r.refreshToken
}

func (r *AuthResponseResolver) User() *UserResolver {
	return &UserResolver{u: r.user, userService: r.userService}
}
