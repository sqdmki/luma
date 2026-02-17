package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	// "github.com/graph-gophers/graphql-go/relay" // Removed relay
	
	"luma/internal/database"
	"luma/internal/graph"
	"luma/internal/logger"
	lumaMiddleware "luma/internal/middleware"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize Logger
	logger.InitLogger()

	// Initialize Database
	database.InitPostgres()
	database.InitRedis()

	// Initialize Echo
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	e.Use(lumaMiddleware.AuthMiddleware)
	
	// Add Rate Limit Middleware
	// Note: In real production, pass Redis client to config. 
	// For now, it uses global database.RDB inside the middleware package which is slightly coupled but fine for this scope.
	e.Use(lumaMiddleware.RateLimitMiddleware())

	// GraphQL Schema
	schema := graph.NewSchema()

	// Custom GraphQL Handler (replaces relay.Handler)
	h := &graph.Handler{Schema: schema}

	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Luma API is running")
	})
	
	// GraphQL Endpoint
	e.POST("/query", func(c echo.Context) error {
		return h.ServeHTTP(c)
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "1323"
	}
	e.Logger.Fatal(e.Start(":" + port))
}
