package models

import (
	"log"
	"time"

	"github.com/uptrace/bun"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID        int64     `bun:"id,pk,autoincrement" json:"id"`
	Username  string    `bun:"username,notnull" json:"username"`
	Email     string    `bun:"email,notnull,unique" json:"email"`
	Password  string    `bun:"password" json:"-"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"createdAt"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"updatedAt"`

	// Relations
	Categories []Category `bun:"rel:has-many,join:id=user_id"`
	Expenses   []Expense  `bun:"rel:has-many,join:id=user_id"`
}

func (u *User) SaveUser() (*User, error) {
	_, err := DB.NewInsert().Model(u).Exec(ctx)

	if err != nil {
		return &User{}, err
	}
	return u, nil
}

func CreateUserTable() {
	_, err := DB.NewCreateTable().Model((*User)(nil)).IfNotExists().Exec(ctx)
	if err != nil {
		log.Println("Failed to create table.", err)
		return
	}
}

func GetOrCreateUser(email string, name string, user_id int) (User, error) {
	var u User

	if email != "" {
		err := DB.NewSelect().Model(&u).Where("email = ?", email).Scan(ctx)
		if err != nil {
			// User not found, create new user
			u.Username = name
			u.Email = email
			u.SaveUser()
			return u, err
		}
		return u, err
	} else if user_id != 0 {
		err := DB.NewSelect().Model(&u).Where("id = ?", user_id).Scan(ctx)
		if err != nil {
			log.Println("Failed to fetch user.", err)
			return u, err
		}
	}
	return u, nil
}
