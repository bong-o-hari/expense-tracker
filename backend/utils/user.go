package utils

import (
	"context"
	"expensetracker/models"

	"golang.org/x/crypto/bcrypt"
)

func LoginCheck(email string, password string) (string, error) {
	var err error
	ctx := context.Background()
	u := &models.User{}

	err = models.DB.NewSelect().Model(u).Where("email = ?", email).Scan(ctx)

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

func GetUserByID(user_id int) (models.User, error) {
	var u models.User
	ctx := context.Background()
	err := models.DB.NewSelect().Model(&u).Where("id = ?", user_id).Scan(ctx)

	if err != nil {
		return u, err
	}
	return u, nil
}
