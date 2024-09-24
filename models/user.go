package models

import (
	"context"
	passwordhashing "expensetracker/hashing"
	"expensetracker/utils/token"
	"time"

	"github.com/uptrace/bun"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID        int64     `bun:"id,pk,autoincrement"`
	Name      string    `bun:"name,notnull"`
	Email     string    `bun:"email,notnull,unique"`
	Password  string    `bun:"-"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}

func (u *User) SaveUser() (*User, error) {
	ctx := context.Background()
	_, err := DB.NewInsert().Model(u).Exec(ctx)

	if err != nil {
		return &User{}, err
	}
	return u, nil
}

func LoginCheck(email string, password string) (string, error) {
	var err error
	ctx := context.Background()
	u := &User{}

	err = DB.NewSelect().Model(u).Where("email = ?", email).Scan(ctx)

	if err != nil {
		return "", err
	}

	check := passwordhashing.VerifyPassword(password, u.Password)

	if !check {
		return "", bcrypt.ErrMismatchedHashAndPassword
	}

	token, err := token.GenerateToken(int(u.ID))

	if err != nil {
		return "", err
	}

	return token, nil
}

func GetUserByID(user_id uint) (User, error) {
	var u User
	ctx := context.Background()
	err := DB.NewSelect().Model(&u).Where("id = ?", user_id).Scan(ctx)

	if err != nil {
		return u, err
	}
	return u, nil
}
