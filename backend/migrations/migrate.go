package migrations

import (
	"expensetracker/models"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrations() {
	// Create a new database instance for migrations
	pgDB, err := postgres.WithInstance(models.DB.DB, &postgres.Config{})
	if err != nil {
		log.Fatalf("failed to open the database: %v", err)
	}

	// Create a new migrate instance
	m, err := migrate.NewWithDatabaseInstance(
		"file://./migrations",
		"postgres",
		pgDB,
	)
	if err != nil {
		log.Fatalf("failed to create migration instance: %v", err)
	}

	// Apply migrations
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("failed to apply migrations: %v", err)
	}

	log.Println("Migrations applied successfully")
}
