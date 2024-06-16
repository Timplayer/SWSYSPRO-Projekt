package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

func hello() http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		writer.Write([]byte("hello world"))
	}
}

func testDBpost(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		tag, err := dbpool.Exec(context.Background(), "INSERT INTO test (name) VALUES ($1)",
			mux.Vars(request)["name"])
		if err != nil {
			log.Fatalf("Failed to add collum to table: %v\n", err)
		}
		log.Printf("Successfully insterted %d rows\n", tag.RowsAffected())
	}
}

func testDBget(db *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		result, _ := db.Query(context.TODO(), "Select name from test ORDER BY id DESC LIMIT 1")
		result.Next()

		var name string
		err := result.Scan(&name)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("failed to scan row: %v", err)
			return
		}

		_, err = writer.Write([]byte(name))
		if err != nil {
			log.Printf("failed to write response: %v\n", err)
			return
		}

	}
}
