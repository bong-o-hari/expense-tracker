package controllers

import (
	"expensetracker/models"
	"expensetracker/utils"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RegisterInput struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type GoogleToken struct {
	Token string `json:"token" binding:"required"`
}

func RegisterUser(c *gin.Context) {

	var input RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u := models.User{}

	u.Username = input.Username
	u.Email = input.Email

	hash, errhash := utils.HashPassword(input.Password)
	if errhash != nil {
		log.Println("Error while hashing password", errhash)
		return
	}
	u.Password = hash

	_, errsave := u.SaveUser()

	// create token at register
	token, err := utils.LoginCheck(u.Email, input.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if errsave != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errsave.Error()})
		return
	}

	c.JSON(201, gin.H{"status": "Successfully registered!", "token": token})
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

	token, err := utils.LoginCheck(u.Email, u.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username or Password incorrect."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func GoogleLogin(c *gin.Context) {
	var input GoogleToken

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("Input", input)
	if input.Token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID token missing"})
		return
	}

	// Verify the ID token using Google's public key
	tokenInfo, err := utils.VerifyGoogleIDToken(input.Token)
	if err != nil {
		log.Println("Failed to verify ID token:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid ID token"})
		return
	}

	// Extract email from userInfo (you can also store user info in the DB)
	email := tokenInfo["email"].(string)
	name := tokenInfo["name"].(string)

	user, err := models.GetOrCreateUser(email, name, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Issue JWT token (implement this as per your current JWT strategy)
	tokenString, err := utils.GenerateToken(int(user.ID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the token to the user
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func CurrentUser(c *gin.Context) {
	user_id, err := utils.ExtractTokenID(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u, err := models.GetOrCreateUser("", "", user_id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": u})

}
