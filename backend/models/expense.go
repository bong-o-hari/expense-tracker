package models

import (
	"log"
	"time"

	"github.com/uptrace/bun"
)

type Expense struct {
	bun.BaseModel `bun:"table:expenses"`

	ID          int64     `bun:"id,pk,autoincrement" json:"id"`
	UserID      int64     `bun:"user_id,notnull" json:"user_id"` // Foreign key for User
	CategoryID  int64     `bun:"category_id,notnull" json:"-"`   // Foreign key for Category
	Amount      float64   `bun:"amount,notnull" json:"amount"`
	Description string    `bun:"description,nullzero" json:"description"`
	ExpenseDate time.Time `bun:"expense_date,notnull" json:"expense_date"`
	CreatedAt   time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"createdAt"`

	// Relations
	User     *User     `bun:"rel:belongs-to,join:user_id=id" json:"-"`
	Category *Category `bun:"rel:belongs-to,join:category_id=id" json:"category"`
}

func CreateExpenseTable() {
	_, err := DB.NewCreateTable().Model((*Expense)(nil)).IfNotExists().Exec(ctx)
	if err != nil {
		log.Println("Failed to create table.", err)
		return
	}
}

func (expense *Expense) SaveExpense() (*Expense, error) {
	_, err := DB.NewInsert().Model(expense).Exec(ctx)

	if err != nil {
		return &Expense{}, err
	}
	return expense, nil
}
