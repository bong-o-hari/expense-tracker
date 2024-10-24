package utils

import (
	"expensetracker/models"
	"log"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func LoginCheck(email string, password string) (string, error) {
	var err error
	u, err := models.GetOrCreateUser(email, "", uuid.Nil)

	if err != nil {
		log.Println(err)
		return "", err
	}

	check := VerifyPassword(password, u.Password)

	if !check {
		return "", bcrypt.ErrMismatchedHashAndPassword
	}

	token, err := GenerateToken(u.ID)

	if err != nil {
		log.Println(err)
		return "", err
	}

	return token, nil
}
