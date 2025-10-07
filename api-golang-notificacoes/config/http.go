package config

import (
	"github.com/gin-gonic/gin"
	"github.com/hellyaxs/api"
)

func StartServer() {
	db := ConnectDB()
	http := gin.Default()
	api.Routes(http, db)
	http.Run(":8080")
}	