package models

import (
	"context"
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var DB *bun.DB
var ctx = context.Background()

func ConnectDatabase() {
	err := godotenv.Load("../.env")

	if err != nil {
		log.Fatal(err)
	}

	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(os.Getenv("DSN"))))
	DB = bun.NewDB(sqldb, pgdialect.New())

	// reflecting User to DB
	CreateUserTable()
	// reflecting Category to DB
	CreateAndPrefillCategoryTable()
	// reflecting Expense to DB
	CreateExpenseTable()

	// ping db to check active connection
	err = DB.Ping()
	if err != nil {
		log.Println("Failed to connect to database.", err)
		return
	}
	log.Println("Connected to the database.")

}
