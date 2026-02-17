package database

import (
	"context"
	"fmt"
	"luma/internal/logger"
	"luma/internal/models"
	"log"
	"os"
	"time"

	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

var DB *gorm.DB

// Custom Zap Logger adapter for GORM
type GormZapLogger struct {
	ZapLogger *zap.Logger
}

func (l *GormZapLogger) LogMode(level gormlogger.LogLevel) gormlogger.Interface {
	return l
}

func (l *GormZapLogger) Info(ctx context.Context, msg string, data ...interface{}) {
	l.ZapLogger.Info(fmt.Sprintf(msg, data...))
}

func (l *GormZapLogger) Warn(ctx context.Context, msg string, data ...interface{}) {
	l.ZapLogger.Warn(fmt.Sprintf(msg, data...))
}

func (l *GormZapLogger) Error(ctx context.Context, msg string, data ...interface{}) {
	l.ZapLogger.Error(fmt.Sprintf(msg, data...))
}

func (l *GormZapLogger) Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error) {
	elapsed := time.Since(begin)
	sql, rows := fc()

	if err != nil {
		l.ZapLogger.Error("GORM Query Error",
			zap.Error(err),
			zap.String("sql", sql),
			zap.Duration("elapsed", elapsed),
		)
		return
	}

	if elapsed > time.Second {
		l.ZapLogger.Warn("GORM Slow Query",
			zap.String("sql", sql),
			zap.Duration("elapsed", elapsed),
			zap.Int64("rows", rows),
		)
	} else {
		// Only log debug if needed
		l.ZapLogger.Debug("GORM Query",
			zap.String("sql", sql),
			zap.Duration("elapsed", elapsed),
			zap.Int64("rows", rows),
		)
	}
}

func InitPostgres() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	// Use Default GORM logger but configured to be quiet
	// Or use custom adapter: &GormZapLogger{ZapLogger: logger.Log}
	// For now let's use the standard one but with Error level only to clean up logs
	newLogger := gormlogger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		gormlogger.Config{
			SlowThreshold:             time.Second,   
			LogLevel:                  gormlogger.Error, // Log only errors
			IgnoreRecordNotFoundError: true,             
			ParameterizedQueries:      true,             
			Colorful:                  false,
		},
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		logger.Log.Fatal("Failed to connect to database", zap.Error(err))
	}

	sqlDB, err := DB.DB()
	if err != nil {
		logger.Log.Fatal("Failed to get SQL DB instance", zap.Error(err))
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	logger.Log.Info("Connected to PostgreSQL successfully")

	// Auto Migration
	logger.Log.Info("Running database migrations...")
	err = DB.AutoMigrate(
		&models.User{},
		&models.Session{},
		&models.Track{},
		&models.Tag{},
		&models.UserTrack{},
		&models.UserFollowing{},
		&models.UserInterest{},
	)
	if err != nil {
		logger.Log.Fatal("Failed to migrate database", zap.Error(err))
	}
	logger.Log.Info("Database migration completed")
}
