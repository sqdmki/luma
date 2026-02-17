package graph

import (
	"context"
	"errors"
	"luma/internal/middleware"
	"luma/internal/services"
)

// ... existing code ...

// --- Track Mutations ---

type CreateTrackArgs struct {
	Input services.CreateTrackInput
}

func (r *Resolver) CreateTrack(ctx context.Context, args CreateTrackArgs) (*TrackResolver, error) {
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		return nil, errors.New("unauthorized")
	}

	track, err := r.TrackService.CreateTrack(userID, args.Input)
	if err != nil {
		return nil, err
	}

	return &TrackResolver{t: track, userService: r.UserService}, nil
}

type DeleteTrackArgs struct {
	ID string
}

func (r *Resolver) DeleteTrack(ctx context.Context, args DeleteTrackArgs) (bool, error) {
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		return false, errors.New("unauthorized")
	}

	err := r.TrackService.DeleteTrack(userID, args.ID)
	if err != nil {
		return false, err
	}
	return true, nil
}

// --- Interaction Mutations ---

type AddToCollectionArgs struct {
	TrackId string
}

func (r *Resolver) AddToCollection(ctx context.Context, args AddToCollectionArgs) (bool, error) {
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		return false, errors.New("unauthorized")
	}

	err := r.TrackService.AddToCollection(userID, args.TrackId)
	return err == nil, err
}

func (r *Resolver) RemoveFromCollection(ctx context.Context, args AddToCollectionArgs) (bool, error) {
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		return false, errors.New("unauthorized")
	}
	err := r.TrackService.RemoveFromCollection(userID, args.TrackId)
	return err == nil, err
}

type FollowArgs struct {
	ArtistId string
}

func (r *Resolver) FollowArtist(ctx context.Context, args FollowArgs) (bool, error) {
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		return false, errors.New("unauthorized")
	}
	err := r.InteractionService.FollowArtist(userID, args.ArtistId)
	return err == nil, err
}

func (r *Resolver) UnfollowArtist(ctx context.Context, args FollowArgs) (bool, error) {
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		return false, errors.New("unauthorized")
	}
	err := r.InteractionService.UnfollowArtist(userID, args.ArtistId)
	return err == nil, err
}

type RecordInterestArgs struct {
	Tag   string
	Score float64
}

func (r *Resolver) RecordInterest(ctx context.Context, args RecordInterestArgs) (bool, error) {
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		return false, errors.New("unauthorized")
	}
	err := r.InteractionService.RecordInterest(userID, args.Tag, args.Score)
	return err == nil, err
}

// --- Track Queries ---

type TracksArgs struct {
	Limit  *int32
	Offset *int32
}

func (r *Resolver) Tracks(ctx context.Context, args TracksArgs) ([]*TrackResolver, error) {
	limit := 10
	if args.Limit != nil {
		limit = int(*args.Limit)
	}
	offset := 0
	if args.Offset != nil {
		offset = int(*args.Offset)
	}

	tracks, err := r.TrackService.GetTracks(limit, offset)
	if err != nil {
		return nil, err
	}

	var resolvers []*TrackResolver
	for i := range tracks {
		resolvers = append(resolvers, &TrackResolver{t: &tracks[i], userService: r.UserService})
	}
	return resolvers, nil
}

type TrackArgs struct {
	ID string
}

func (r *Resolver) Track(ctx context.Context, args TrackArgs) (*TrackResolver, error) {
	track, err := r.TrackService.GetTrack(args.ID)
	if err != nil {
		return nil, err
	}
	return &TrackResolver{t: track, userService: r.UserService}, nil
}
