package config

import (
	"os"

	"github.com/hellyaxs/internal/domain"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func getEnvOrDefault(key, defaultValue string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultValue
}

func ConnectDB() *gorm.DB {
	_ = godotenv.Load()

	host := getEnvOrDefault("DB_HOST", "localhost")
	user := getEnvOrDefault("DB_USER", "postgres")
	password := os.Getenv("DB_PASSWORD")
	dbname := getEnvOrDefault("DB_NAME", "postgres")
	port := getEnvOrDefault("DB_PORT", "5432")

	dsn := "host=" + host + " user=" + user + " password=" + password + " dbname=" + dbname + " port=" + port + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database: " + err.Error())
	}

	if err := db.AutoMigrate(&domain.Person{}, &domain.Phone{}); err != nil {
		panic("failed to run AutoMigrate: " + err.Error())
	}

	return db
}
