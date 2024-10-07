package main

import (
	"expensetracker/controllers"
	middleware "expensetracker/middlewares"
	"expensetracker/migrations"
	"expensetracker/models"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Expense Tracker")

	models.ConnectDatabase()
	migrations.RunMigrations()

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
	user.POST("/google/login", controllers.GoogleLogin)

	// Protected APIs
	protected := router.Group("/admin")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/current", controllers.CurrentUser)
	protected.GET("/categories", controllers.ListAllCategories)
	protected.POST("/category/new", controllers.AddNewCategory)
	protected.GET("/expenses", controllers.ListAllExpenses)
	protected.POST("/expense/new", controllers.AddNewExpense)
	protected.DELETE("/expense", controllers.SoftDeleteExpense)

	router.Run(":8000")
}
