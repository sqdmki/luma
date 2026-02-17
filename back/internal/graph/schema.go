package graph

import (
	_ "embed"

	"luma/internal/services"

	"github.com/graph-gophers/graphql-go"
)

//go:embed schema.graphql
var schemaString string

func NewSchema() *graphql.Schema {
	return graphql.MustParseSchema(schemaString, &Resolver{
		AuthService:        &services.AuthService{},
		UserService:        &services.UserService{},
		TrackService:       &services.TrackService{},
		InteractionService: &services.InteractionService{},
	})
}
