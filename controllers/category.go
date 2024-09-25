package controllers

import (
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
