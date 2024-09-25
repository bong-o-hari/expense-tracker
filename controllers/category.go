package controllers

import (
	"context"
	"expensetracker/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Category struct {
	CategoryName string `json:"category_name"`
}

func AddNewCategory(c *gin.Context) {
	var input Category

	cat := &models.Category{}

	cat.CategoryName = input.CategoryName

	_, errsave := cat.SaveCategory()

	if errsave != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errsave.Error()})
		return
	}
}

func ListAllCategories(c *gin.Context) {
	var cat []models.Category
	ctx := context.Background()
	err := models.DB.NewSelect().Model(&cat).Scan(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "data": cat})
}
