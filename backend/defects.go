package main

import (
	"context"
	"errors"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
	"time"
)

type defect struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
}

func updateDefect(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		d, fail := getRequestBody[defect](writer, request.Body)
		if fail {
			return
		}
		rows, err := dbpool.Query(context.Background(), "UPDATE defects SET name = $1, date = $2, description = $3, status = $4 WHERE id = $5 RETURNING id", d.Name, d.Date, d.Description, d.Status, mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, updateOperation, cDefect, err)
			return
		}
		defer rows.Close()
		sendResponseDefects(writer, rows, err, d, updateOperation)
		return
	}
}

func postDefect(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		d, fail := getRequestBody[defect](writer, request.Body)
		if fail {
			return
		}
		err := dbpool.QueryRow(context.Background(),
			"INSERT INTO defects (name, date, description, status) VALUES ($1, $2, $3, $4) RETURNING id",
			d.Name, d.Date, d.Description, d.Status).Scan(&d.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cDefect, err)
			return
		}
		returnTAsJSON(writer, d, http.StatusCreated)
	}
}

func getDefectByID(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		var d defect
		err := dbpool.QueryRow(context.Background(),
			"SELECT id, name, date, description, status FROM defects WHERE defects.id = $1",
			mux.Vars(request)["id"]).Scan(&d.Id, &d.Name, &d.Date, &d.Description, &d.Status)
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cDefect, cDefect)
			return
		} else if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cDefect, err)
			return
		}
		returnTAsJSON(writer, d, http.StatusOK)
	}
}

func getDefects(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM defects")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorDatabaseConnection, err)
			return
		}
		defer rows.Close()
		defects, err := pgx.CollectRows(rows,
			func(row pgx.CollectableRow) (defect, error) {
				var d defect
				err := rows.Scan(&d.Id, &d.Name, &d.Date, &d.Description, &d.Status)
				return d, err
			})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cDefect, err)
			return
		}
		returnTAsJSON(writer, defects, http.StatusOK)
	}
}

func sendResponseDefects(writer http.ResponseWriter, rows pgx.Rows, err error, d *defect, operationType string) bool {
	rows.Next()
	var id int64
	err = rows.Scan(&id)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, operationType, cDefect, err)
		return false
	}
	log.Printf(genericSuccess, operationType, cDefect, id)
	returnTAsJSON(writer, d, http.StatusCreated)
	return false
}

func createDefectsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS defects (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, date TIMESTAMP NOT NULL, description TEXT, status TEXT);")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
