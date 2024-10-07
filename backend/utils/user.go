package utils

import (
	"expensetracker/models"

	"golang.org/x/crypto/bcrypt"
)

func LoginCheck(email string, password string) (string, error) {
	var err error
	u, err := models.GetOrCreateUser(email, "", 0)

	if err != nil {
		return "", err
	}

	check := VerifyPassword(password, u.Password)

	if !check {
		return "", bcrypt.ErrMismatchedHashAndPassword
	}

	token, err := GenerateToken(int(u.ID))

	if err != nil {
		return "", err
	}

	return token, nil
}
