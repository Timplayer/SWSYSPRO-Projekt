package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

type producer struct {
	Id   int64  `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

func updateProducer(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		p, fail := getRequestBody[producer](writer, request.Body)
		if fail {
			return
		}
		result, err := dbpool.Exec(context.Background(), "UPDATE producers SET name = $1 WHERE id = $2", p.Name, p.Id)
		fail = checkUpdateSingleRow(writer, err, result, "updating producer")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cProducer, p.Id)
		returnTAsJSON(writer, p, http.StatusCreated)
	}
}

func postProducers(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		p, fail := getRequestBody[producer](writer, request.Body)
		if fail {
			return
		}
		err := dbpool.QueryRow(context.Background(),
			"INSERT INTO producers (name) VALUES ($1) RETURNING id", p.Name).Scan(&p.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cProducer, err)
			return
		}
		log.Printf(genericSuccess, insertOperation, cProducer, p.Id)
		returnTAsJSON(writer, p, http.StatusCreated)
	}
}

func getProducerById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		p, fail := getT[producer](writer, request, dbpool, cDefect,
			"SELECT * FROM producers WHERE producers.id = $1",
			mux.Vars(request)["id"])
		if fail {
			return
		}
		returnTAsJSON(writer, p, http.StatusOK)
	}
}

func getProducers(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		producers, fail := getTs[producer](writer, request, dbpool, cProducer, "SELECT * FROM producers")
		if fail {
			return
		}
		returnTAsJSON(writer, producers, http.StatusOK)
	}
}

func createProducersTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS producers (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL)")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
