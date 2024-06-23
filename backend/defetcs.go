package main

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"time"
)

type defect struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
}

func createDefectsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS defects (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, date TIMESTAMP NOT NULL, description TEXT);")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
