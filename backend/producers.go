package main

import (
	"context"
	"encoding/json"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"net/http"
)

type producer struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

func postProducers(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		var p producer
		err = json.Unmarshal(body, &p)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO producers (name) VALUES ($1) RETURNING id", p.Name)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert producer: %v", err)
			return
		}
		defer rows.Close()
		rows.Next()
		var id int64
		err = rows.Scan(&id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert producer: %v", err)
			return
		}
		log.Printf("Inserted producer: %d", id)
		p.Id = id
		body, err = json.Marshal(p)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing producer: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
}

func createProducersTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS producers (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL)")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
