package graph

import (
	"encoding/json"
	"fmt"
	"luma/internal/utils"
	"net/http"
	"strings"

	"github.com/graph-gophers/graphql-go"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	Schema *graphql.Schema
}

type GraphQLRequest struct {
	Query         string                 `json:"query"`
	OperationName string                 `json:"operationName"`
	Variables     map[string]interface{} `json:"variables"`
}

type EncryptedRequest struct {
	Payload string `json:"payload"`
}

func (h *Handler) ServeHTTP(c echo.Context) error {
	var req GraphQLRequest

	// 1. Decryption / Parsing
	if c.Request().Header.Get("X-Encrypted-Query") == "true" {
		var wrapper EncryptedRequest
		if err := c.Bind(&wrapper); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid encrypted request format")
		}
		
		decryptedJSON, err := utils.Decrypt(wrapper.Payload)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Failed to decrypt query")
		}
		
		if err := json.Unmarshal([]byte(decryptedJSON), &req); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid decrypted JSON")
		}
	} else {
		// Fallback to standard
		if err := c.Bind(&req); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Could not parse request")
		}
	}

	// 2. Introspection Check
	if strings.Contains(req.Query, "__schema") || strings.Contains(req.Query, "__type") {
		return echo.NewHTTPError(http.StatusForbidden, "Introspection is disabled")
	}

	// 3. Depth Limiting
	// Simple heuristic: count '{' nesting level.
	depth := calculateDepth(req.Query)
	if depth > 5 { // Max depth 5
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Query too deep: %d (max 5)", depth))
	}

	// 4. Execution
	ctx := c.Request().Context()
	response := h.Schema.Exec(ctx, req.Query, req.OperationName, req.Variables)

	return c.JSON(http.StatusOK, response)
}

func calculateDepth(query string) int {
	maxDepth := 0
	currentDepth := 0
	for _, char := range query {
		if char == '{' {
			currentDepth++
			if currentDepth > maxDepth {
				maxDepth = currentDepth
			}
		} else if char == '}' {
			currentDepth--
		}
	}
	return maxDepth
}
