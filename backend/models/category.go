package models

import (
	"fmt"
	"log"
	"time"

	"github.com/uptrace/bun"
)

type Category struct {
	bun.BaseModel `bun:"table:categories"`

	ID           int64     `bun:"id,pk,autoincrement" json:"id"`
	CategoryName string    `bun:"categoryname,notnull" json:"category_name"`
	UserID       int64     `bun:"user_id,notnull,default:0" json:"user_id"`
	CreatedAt    time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"createdAt"`

	// Relations
	Expenses []Expense `bun:"rel:has-many,join:id=category_id" json:"expenses"`
	User     *User     `bun:"rel:belongs-to,join:user_id=id" json:"user"`
}

func (cat *Category) SaveCategory() (*Category, error) {
	_, err := DB.NewInsert().Model(cat).Exec(ctx)

	if err != nil {
		return &Category{}, err
	}
	return cat, nil
}

func CreateAndPrefillCategoryTable() {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name ='categories')`
	err := DB.NewRaw(query).Scan(ctx, &exists)
	if err != nil {
		log.Println("Fail checking if table exists.", err)
		return
	}

	if !exists {
		_, err = DB.NewCreateTable().Model((*Category)(nil)).IfNotExists().Exec(ctx)
		if err != nil {
			log.Println("Failed to create table.", err)
			return
		}

		defaultCategories := []Category{
			{CategoryName: "Housing"},
			{CategoryName: "Utilities"},
			{CategoryName: "Groceries"},
			{CategoryName: "Tranportation"},
			{CategoryName: "Insurance"},
			{CategoryName: "Healthcare"},
			{CategoryName: "Entertainment"},
			{CategoryName: "Dining Out"},
			{CategoryName: "Personal Care"},
			{CategoryName: "Clothing"},
			{CategoryName: "Education"},
			{CategoryName: "Subscriptions"},
			{CategoryName: "Debt Repayment"},
			{CategoryName: "Savings and Investments"},
			{CategoryName: "Gifts and Donations"},
			{CategoryName: "Miscellaneous"},
		}
		_, err = DB.NewInsert().Model(&defaultCategories).Exec(ctx)
		if err != nil {
			log.Println("Error inserting default categories", err)
		}

		fmt.Println("Category table created and filled with default data.")
	}
}

func ListCategories(user_id int) ([]Category, error) {
	var cat []Category
	err := DB.NewSelect().Model(&cat).Where("user_id = ?", user_id).WhereOr("user_id = ?", 0).Scan(ctx)

	if err != nil {
		log.Println("Error fetching categories", err)
		return nil, err
	}
	return cat, nil
}
