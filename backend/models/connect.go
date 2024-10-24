package models

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var DB *bun.DB
var ctx = context.Background()

func EnableUUIDExtension() error {
	ctx := context.Background()
	_, err := DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"", ctx)
	if err != nil {
		return fmt.Errorf("failed to create uuid-ossp extension: %w", err)
	}
	return nil
}

func ConnectDatabase() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal(err)
	}

	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(os.Getenv("DSN"))))
	DB = bun.NewDB(sqldb, pgdialect.New())

	// Enabling UUID
	EnableUUIDExtension()
	// reflecting User to DB
	CreateUserTable()
	// reflecting Category to DB
	CreateAndPrefillCategoryTable()
	// reflecting Expense to DB
	CreateExpenseTable()
	// reflecting Income to DB
	CreateIncomeTable()

	// ping db to check active connection
	err = DB.Ping()
	if err != nil {
		log.Println("Failed to connect to database.", err)
		return
	}
	log.Println("Connected to the database.")

}
