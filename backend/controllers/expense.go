package controllers

import (
	"context"
	"expensetracker/models"
	"expensetracker/utils"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AddExpense struct {
	CategoryID  uuid.UUID `json:"category_id" binding:"required"`
	Amount      float64   `json:"amount" binding:"required"`
	Description string    `json:"description" binding:"required"`
	ExpenseDate string    `json:"expense_date" binding:"required"`
}

func AddNewExpense(c *gin.Context) {
	var input AddExpense
	expense := models.Expense{}

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

	expense.UserID = user_id
	expense.CategoryID = input.CategoryID
	expense.Amount = float64(input.Amount)
	expense.Description = input.Description

	expenseDate, err := time.Parse("2006-01-02", input.ExpenseDate)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	expense.ExpenseDate = expenseDate
	_, err = expense.SaveExpense()
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Successfully added your expense!"})
}

func SoftDeleteExpense(c *gin.Context) {
	expense := models.Expense{}
	expenseId := c.Query("id")
	ctx := context.Background()
	_, err := models.DB.NewDelete().Model(&expense).Where("id = ?", expenseId).Exec(ctx)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted expense."})
}

func ListAllExpenses(c *gin.Context) {
	user_id, err := utils.ExtractTokenID(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	month := c.Query("month")
	year := c.Query("year")
	expenses, totalExpense, err := models.FilterExpenseByMonthAndYear(user_id, month, year)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success", "total_expense": totalExpense, "data": expenses})
}
