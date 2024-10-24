package models

import (
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Income struct {
	bun.BaseModel `bun:"table:incomes"`

	ID         uuid.UUID `bun:"type:uuid,default:uuid_generate_v4(),pk" json:"id"`
	UserID     uuid.UUID `bun:"type:uuid,notnull" json:"user_id"` // Foreign key for User
	Amount     float64   `bun:"amount,notnull" json:"amount"`
	Source     string    `bun:"source,nullzero" json:"source"` // Source of income
	IncomeDate time.Time `bun:"income_date,notnull" json:"income_date"`
	CreatedAt  time.Time `bun:",nullzero,notnull,default:current_timestamp" json:"createdAt"`
	DeletedAt  time.Time `bun:"deleted_at,soft_delete,nullzero" json:"-"`

	// Relations
	User *User `bun:"rel:belongs-to,join:user_id=id" json:"-"`
}

func CreateIncomeTable() {
	_, err := DB.NewCreateTable().Model((*Income)(nil)).IfNotExists().Exec(ctx)
	if err != nil {
		log.Println("Failed to create table.", err)
		return
	}
}

func (income *Income) SaveIncome() (*Income, error) {
	_, err := DB.NewInsert().Model(income).Exec(ctx)

	if err != nil {
		log.Println(err)
		return &Income{}, err
	}
	return income, nil
}

func FilterIncomeByMonthAndYear(user_id uuid.UUID, month string, year string) ([]Income, float64, error) {
	var incomes []Income
	var totalIncome float64

	query := DB.NewSelect().Model(&incomes).Where("income.user_id = ?", user_id).
		OrderExpr("income.income_date DESC")

	if month != "" && year != "" {
		query = query.Where("EXTRACT(YEAR FROM income.income_date) = ?", year).
			Where("EXTRACT(MONTH FROM income.income_date) = ?", month)
	} else if month == "" && year != "" {
		query = query.Where("EXTRACT(YEAR FROM income.income_date) = ?", year)
	}

	err := query.Scan(ctx)
	if err != nil {
		log.Println(err)
		return nil, 0, err
	}

	// Query to sum the total income for the selected period
	sumQuery := DB.NewSelect().Model(&Income{}).
		ColumnExpr("COALESCE(SUM(income.amount), 0)").
		Where("user_id = ?", user_id)

	if month != "" && year != "" {
		sumQuery = sumQuery.Where("EXTRACT(YEAR FROM income.income_date) = ?", year).
			Where("EXTRACT(MONTH FROM income.income_date) = ?", month)
	} else if month == "" && year != "" {
		sumQuery = sumQuery.Where("EXTRACT(YEAR FROM income.income_date) = ?", year)
	}

	err = sumQuery.Scan(ctx, &totalIncome)
	if err != nil {
		log.Println(err)
		return nil, 0, err
	}

	return incomes, totalIncome, err
}
