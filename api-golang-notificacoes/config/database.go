package config

import (
	"fmt"

	"github.com/hellyaxs/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)
  
func ConnectDB() *gorm.DB {
	dsn := "host=localhost user=postgres password=root dbname=postgres port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	fmt.Println("Connected to database", db)

	db.AutoMigrate(&domain.Person{}, &domain.Phone{})
	if err != nil {
		panic("failed to connect database")
	}
	return db
}
