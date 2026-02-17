package graph

import (
	"luma/internal/services"
)

type Resolver struct {
	AuthService        *services.AuthService
	UserService        *services.UserService
	TrackService       *services.TrackService
	InteractionService *services.InteractionService
}
