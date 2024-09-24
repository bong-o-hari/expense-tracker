package controllers

import (
	passwordhashing "expensetracker/hashing"
	"expensetracker/models"
	"expensetracker/utils/token"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RegisterInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func RegisterUser(c *gin.Context) {

	var input RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := models.User{}

	u.Name = input.Name
	u.Email = input.Email

	hash, errhash := passwordhashing.HashPassword(input.Password)
	if errhash != nil {
		log.Println("Error while hashing password", errhash)
		return
	}
	u.Password = hash

	_, errsave := u.SaveUser()

	if errsave != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errsave.Error()})
		return
	}

	c.JSON(201, gin.H{"status": "Successfully registered!"})
}

func LoginUser(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := models.User{}

	u.Email = input.Email
	u.Password = input.Password

	token, err := models.LoginCheck(u.Email, u.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username or Password incorrect."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func CurrentUser(c *gin.Context) {
	user_id, err := token.ExtractTokenID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u, err := models.GetUserByID(user_id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": u})

}
