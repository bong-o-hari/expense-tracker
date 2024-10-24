package controllers

import (
	"context"
	"expensetracker/models"
	"expensetracker/utils"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type AddIncome struct {
	Amount     float64 `json:"amount" binding:"required"`
	Source     string  `json:"source" binding:"required"`
	IncomeDate string  `json:"income_date" binding:"required"`
}

func AddNewIncome(c *gin.Context) {
	var input AddIncome
	income := models.Income{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user_id, err := utils.ExtractTokenID(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	income.UserID = user_id
	income.Source = input.Source
	income.Amount = float64(input.Amount)

	incomeDate, err := time.Parse("2006-01-02", input.IncomeDate)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	income.IncomeDate = incomeDate
	_, err = income.SaveIncome()
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Successfully added your income!"})
}

func SoftDeleteIncome(c *gin.Context) {
	income := models.Income{}
	incomeId := c.Query("id")
	ctx := context.Background()
	_, err := models.DB.NewDelete().Model(&income).Where("id = ?", incomeId).Exec(ctx)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted expense."})
}

func ListAllIncomes(c *gin.Context) {
	user_id, err := utils.ExtractTokenID(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	month := c.Query("month")
	year := c.Query("year")
	incomes, totalIncome, err := models.FilterIncomeByMonthAndYear(user_id, month, year)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "total_income": totalIncome, "data": incomes})
}
