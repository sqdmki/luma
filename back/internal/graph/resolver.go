package graph

import (
	"context"
	"luma/internal/middleware"
	"luma/internal/services"
)

// --- Mutations ---

type RegisterArgs struct {
	Input services.RegisterInput
}

func (r *Resolver) Register(ctx context.Context, args RegisterArgs) (*AuthResponseResolver, error) {
	// First register
	_, err := r.AuthService.Register(args.Input)
	if err != nil {
		return nil, err
	}

	// Then auto-login
	loginResp, err := r.AuthService.Login(services.LoginInput{
		Email:    args.Input.Email,
		Password: args.Input.Password,
	})
	if err != nil {
		return nil, err // Should ideally wrap "registration successful but auto-login failed"
	}

	return &AuthResponseResolver{
		token:        loginResp.Token,
		refreshToken: loginResp.RefreshToken,
		user:         &loginResp.User,
		userService:  r.UserService,
	}, nil
}

type LoginArgs struct {
	Input services.LoginInput
}

func (r *Resolver) Login(ctx context.Context, args LoginArgs) (*AuthResponseResolver, error) {
	resp, err := r.AuthService.Login(args.Input)
	if err != nil {
		return nil, err
	}

	return &AuthResponseResolver{
		token:        resp.Token,
		refreshToken: resp.RefreshToken,
		user:         &resp.User,
		userService:  r.UserService,
	}, nil
}

// --- Queries ---

func (r *Resolver) Hello(ctx context.Context) string {
	return "Hello, world!"
}

func (r *Resolver) Me(ctx context.Context) *UserResolver {
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		return nil // Not authenticated
	}

	user, err := r.UserService.GetUser(userID)
	if err != nil || user == nil {
		return nil
	}

	return &UserResolver{u: user, userService: r.UserService}
}
