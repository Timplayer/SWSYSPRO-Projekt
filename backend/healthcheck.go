package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

func hello() http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		_, err := writer.Write([]byte("hello world"))
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func testDBpost(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		tag, err := dbpool.Exec(context.Background(), "INSERT INTO test (name) VALUES ($1)",
			mux.Vars(request)["name"])
		if err != nil {
			http.Error(writer, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			log.Fatalf("Failed to add collum to table: %v\n", err)
		}
		writer.WriteHeader(http.StatusCreated)
		log.Printf("Successfully insterted %d rows\n", tag.RowsAffected())
	}
}

type name struct {
	Name string
}

func testDBget(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (name, bool) {

	n, fail := getT[name](writer, request, tx, "healthcheck", "Select name from test ORDER BY id DESC LIMIT 1")
	if fail {
		return name{}, true
	}
	return n, false
}
