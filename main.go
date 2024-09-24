package main

import (
	"expensetracker/controllers"
	middleware "expensetracker/middlewares"
	"expensetracker/models"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Expense Tracker")

	models.ConnectDatabase()

	router := gin.Default()
	router.Use(middleware.LoggerMiddleware())

	// Home Apis
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Ok"})
	})

	// User apis
	user := router.Group("/user")
	user.POST("/register", controllers.RegisterUser)
	user.POST("/login", controllers.LoginUser)

	// Protected APIs
	protected := router.Group("/admin")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/current", controllers.CurrentUser)

	router.Run(":8000")
}
