package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

type producer struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

func updateProducer(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		p, fail := getRequestBody[producer](writer, request.Body)
		if fail {
			return
		}
		rows, err := dbpool.Query(context.Background(), "UPDATE producers SET name = $1 WHERE id = $2 RETURNING id", p.Name, mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error updating producer: %p\n", err)
			return
		}
		defer rows.Close()

		sendResponseProducers(writer, rows, err, p, updateOperation, cProducer)
		return
	}
}

func postProducers(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		p, fail := getRequestBody[producer](writer, request.Body)
		if fail {
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO producers (name) VALUES ($1) RETURNING id", p.Name)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cProducer, err)
			return
		}
		defer rows.Close()

		sendResponseProducers(writer, rows, err, p, insertOperation, cProducer)
		return
	}
}

func getProducerById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM producers WHERE producers.id = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cProducer, err)
		}
		defer rows.Close()

		if rows.Next() {
			var p producer
			err = rows.Scan(&p.Id, &p.Name)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cProducer, err)
				return
			}
			str, err := json.Marshal(p)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cProducer, err)
				return
			}
			writer.Header().Set(contentType, applicationJSON)
			_, err = writer.Write(str)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cProducer, err)
				return
			}
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cProducer, cProducer)
			return
		}
	}
}

func getProducers(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM producers")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
		}
		defer rows.Close()
		producers, err := pgx.CollectRows(rows,
			func(row pgx.CollectableRow) (producer, error) {
				var p producer
				err := rows.Scan(&p.Id, &p.Name)
				return p, err
			})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cProducer, err)
			return
		}
		str, err := json.Marshal(producers)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cProducer, err)
			return
		}
		writer.Header().Set(contentType, applicationJSON)
		_, err = writer.Write(str)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cProducer, err)
			return
		}
	}
}

func sendResponseProducers(writer http.ResponseWriter, rows pgx.Rows, err error, p *producer, operationType string, structName string) bool {
	rows.Next()
	var id int64
	err = rows.Scan(&id)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, operationType, structName, err)
		return false
	}
	log.Printf(genericSuccess, operationType, structName, id)
	p.Id = id
	body, err := json.Marshal(p)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorSerializingGeneric, err, structName)
		return false
	}
	writer.Header().Set(contentType, applicationJSON)
	writer.WriteHeader(http.StatusCreated)
	_, err = writer.Write(body)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, operationType, structName, err)
		return false
	}
	return false
}

func createProducersTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS producers (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL)")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
