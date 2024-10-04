package controllers

import (
	"context"
	"expensetracker/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type NewCategory struct {
	CategoryName string `json:"category_name" binding:"required"`
}

func AddNewCategory(c *gin.Context) {
	var input NewCategory

	cat := models.Category{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cat.CategoryName = input.CategoryName

	_, err := cat.SaveCategory()

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"status": "Successfully added new category!"})
}

func ListAllCategories(c *gin.Context) {
	var cat []models.Category
	ctx := context.Background()
	err := models.DB.NewSelect().Model(&cat).Scan(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "data": cat})
}
