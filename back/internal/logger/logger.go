package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Log *zap.Logger

func InitLogger() {
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.TimeKey = "timestamp"
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	// encoderConfig.StacktraceKey = "" // Disable stacktrace for clearer logs in regular usage

	config := zap.Config{
		Level:             zap.NewAtomicLevelAt(zap.InfoLevel),
		Development:       os.Getenv("ENV") != "production",
		Encoding:          "console", // Default to console
		EncoderConfig:     encoderConfig,
		OutputPaths:       []string{"stdout"},
		ErrorOutputPaths:  []string{"stderr"},
		DisableStacktrace: true,
	}

	if os.Getenv("ENV") == "production" {
		config.Encoding = "json" // Switch to JSON in production
	}

	var err error
	Log, err = config.Build()
	if err != nil {
		panic(err)
	}
	defer Log.Sync()
}
