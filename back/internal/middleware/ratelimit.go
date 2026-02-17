package middleware

import (
	"fmt"
	"luma/internal/database"
	"luma/internal/logger"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-redis/redis_rate/v10"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

var limiter *redis_rate.Limiter

func InitRateLimiter() {
	if database.RDB != nil {
		limiter = redis_rate.NewLimiter(database.RDB)
	}
}

func RateLimitMiddleware() echo.MiddlewareFunc {
	// Initialize limiter if not already
	if limiter == nil {
		InitRateLimiter()
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Fail open if Redis is down/not configured
			if limiter == nil {
				return next(c)
			}

			// Identify user
			ip := c.RealIP()
			userID, ok := c.Get("userID").(string)
			
			var key string
			var limit int
			var limitType string

			if ok && userID != "" {
				// Authenticated User: Key based on UserID
				key = fmt.Sprintf("rate_limit:user:%s", userID)
				limit = getEnvAsInt("RATE_LIMIT_USER", 50) // Default 50 req/sec
				limitType = "user"
			} else {
				// Guest: Key based on IP
				key = fmt.Sprintf("rate_limit:ip:%s", ip)
				limit = getEnvAsInt("RATE_LIMIT_GUEST", 10) // Default 10 req/sec
				limitType = "ip"
			}

			// Use Token Bucket algorithm (AllowN)
			// redis_rate.PerSecond(limit) means `limit` requests per second
			res, err := limiter.Allow(c.Request().Context(), key, redis_rate.PerSecond(limit))
			
			if err != nil {
				// Log error but allow request if Redis fails (fail-open strategy)
				logger.Log.Error("Rate limit check failed", zap.Error(err), zap.String("key", key))
				return next(c)
			}

			// Add Rate Limit Headers
			c.Response().Header().Set("X-RateLimit-Limit", strconv.Itoa(limit))
			c.Response().Header().Set("X-RateLimit-Remaining", strconv.Itoa(res.Remaining))
			c.Response().Header().Set("X-RateLimit-Reset", strconv.Itoa(int(res.ResetAfter/time.Second)))
			c.Response().Header().Set("X-RateLimit-Type", limitType)

			if res.Allowed == 0 {
				// Rate limit exceeded
				retryAfter := int(res.RetryAfter / time.Second)
				if retryAfter < 1 {
					retryAfter = 1
				}
				c.Response().Header().Set("Retry-After", strconv.Itoa(retryAfter))
				
				return echo.NewHTTPError(http.StatusTooManyRequests, fmt.Sprintf("Rate limit exceeded. Try again in %d seconds.", retryAfter))
			}

			return next(c)
		}
	}
}

func getEnvAsInt(name string, defaultVal int) int {
	valStr := os.Getenv(name)
	if valStr == "" {
		return defaultVal
	}
	val, err := strconv.Atoi(valStr)
	if err != nil {
		return defaultVal
	}
	return val
}
