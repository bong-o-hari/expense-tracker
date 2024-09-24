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

func ConnectDatabase() {
	err := godotenv.Load()
	ctx := context.Background()

	if err != nil {
		log.Fatal(err)
	}

	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(os.Getenv("DSN"))))
	DB = bun.NewDB(sqldb, pgdialect.New())

	// reflecting tables to DB
	res, err := DB.NewCreateTable().Model((*User)(nil)).IfNotExists().Exec(ctx)
	if err != nil {
		log.Println("Failed to create table.", err)
		return
	}
	log.Println(res)

	// ping db to check active connection
	err = DB.Ping()
	if err != nil {
		log.Println("Failed to connect to database.", err)
		return
	}
	log.Println("Connected to the database.")

}
