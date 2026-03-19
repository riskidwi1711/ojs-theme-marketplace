package main

import (
	"context"
	"fmt"
	"os"

	"ojs-server/internal/config"
	"ojs-server/internal/infrastructure/postgresql"
	"ojs-server/internal/pkg/log"
	"ojs-server/internal/pkg/seeds"
)

func main() {
	config.Load(os.Getenv("env"), ".env")
	log.New()

	dbConfig := &config.PostgreSQLDB{
		Username:           config.GetString("postgresql.username"),
		Password:           config.GetString("postgresql.password"),
		Name:               config.GetString("postgresql.db"),
		Schema:             config.GetString("postgresql.schema"),
		Host:               config.GetString("postgresql.host"),
		Port:               config.GetInt("postgresql.port"),
		MinIdleConnections: config.GetInt("postgresql.minIdleConnections"),
		MaxOpenConnections: config.GetInt("postgresql.maxOpenConnections"),
		MaxLifetime:        config.GetInt("postgresql.maxLifetime"),
		LogMode:            config.GetBool("postgresql.logMode"),
	}
	db := postgresql.NewDB(*dbConfig)

	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")

	ctx := context.Background()
	log.Info(ctx, "Seeder", "Starting")

	// * Transaction
	tx, err := db.Begin()
	if err != nil {
		panic(err)
	}

	for _, seed := range seeds.All() {
		log.Info(ctx, "Seeder", seed.Name)
		if err := seed.Run(tx); err != nil {
			log.Fatal(ctx, fmt.Sprintf("Running seed '%s', failed with error: %s", seed.Name, err))
			tx.Rollback()
			return
		}
	}
	tx.Commit()
	log.Info(ctx, "Seeder", "Finished")
}
