package models

import (
	"log"
	"time"

	"github.com/uptrace/bun"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID        int64     `bun:"id,pk,autoincrement" json:"id"`
	Name      string    `bun:"name,notnull" json:"name"`
	Email     string    `bun:"email,notnull,unique" json:"email"`
	Password  string    `bun:"password,notnull" json:"-"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"createdAt"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"updatedAt"`

	// Relation to Expenses
	Expenses []Expense `bun:"rel:has-many,join:id=user_id"`
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
