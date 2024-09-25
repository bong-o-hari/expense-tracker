package models

import (
	"time"

	"github.com/uptrace/bun"
)

type Category struct {
	bun.BaseModel `bun:"table:categories"`

	ID           int64     `bun:"id,pk,autoincrement" json:"id"`
	CategoryName string    `bun:"categoryname,notnull" json:"categoryName"`
	CreatedAt    time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"createdAt"`

	// Relation to Expenses
	Expenses []Expense `bun:"rel:has-many,join:id=category_id"`
}
