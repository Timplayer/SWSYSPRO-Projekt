package main

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

type image struct {
	Id       int64     `json:"id"`
	FileName string    `json:"file_name"`
	File     http.File `json:"file"`
}

func createImagesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS images (id BIGSERIAL PRIMARY KEY, fileName TEXT, file bytea)")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
