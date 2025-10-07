package api

import (
	"github.com/gin-gonic/gin"
	"github.com/hellyaxs/api/handlers"
	"gorm.io/gorm"
)


func Routes(router *gin.Engine, db *gorm.DB) {
	router.POST("/person", handlers.NewPersonController(db).CreatePerson)
	router.GET("/person", handlers.NewPersonController(db).GetPerson)
	router.GET("/person/:id", handlers.NewPersonController(db).GetPersonById)
	router.PUT("/person/:id", handlers.NewPersonController(db).UpdatePerson)
	router.DELETE("/person/:id", handlers.NewPersonController(db).DeletePerson)
}