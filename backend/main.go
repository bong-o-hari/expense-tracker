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

	// Home APIs
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Ok"})
	})

	// User APIs
	user := router.Group("/user")
	user.POST("/register", controllers.RegisterUser)
	user.POST("/login", controllers.LoginUser)
	user.POST("/google/login", controllers.GoogleLogin)

	// Admin APIs
	admin := router.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.GET("/current", controllers.CurrentUser)

	// Process APIs
	process := router.Group("/process")
	process.Use(middleware.AuthMiddleware())

	process.GET("/categories", controllers.ListAllCategories)
	process.POST("/category/new", controllers.AddNewCategory)

	process.GET("/expenses", controllers.ListAllExpenses)
	process.POST("/expense/new", controllers.AddNewExpense)
	process.DELETE("/expense", controllers.SoftDeleteExpense)

	process.GET("/incomes", controllers.ListAllIncomes)
	process.POST("/income/new", controllers.AddNewIncome)
	process.DELETE("/incomes", controllers.SoftDeleteIncome)

	router.Run(":8000")
}
