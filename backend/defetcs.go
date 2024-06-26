package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
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
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading body: %s", err)
			return
		}
		var d defect
		err = json.Unmarshal(body, &d)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error parsing body: %s", err)
			return
		}
		rows, err := dbpool.Query(context.Background(), "update defects set name = $1, date = $2, description = $3, status = $4 where id = $2", d.Name, d.Id, d.Date, d.Description, d.Status)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error updating defects: %s", err)
			return
		}
		defer rows.Close()
		rows.Next()
		var id int64
		err = rows.Scan(&id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing update defect: %v", err)
			return
		}
		log.Printf("Updated defect: %d", id)
		d.Id = id
		body, err = json.Marshal(d)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing defect: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
}

func postDefect(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		var d defect
		err = json.Unmarshal(body, &d)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO defects (name, date, description, status) VALUES ($1, $2, $3, $4) RETURNING id",
			d.Name, d.Date, d.Description, d.Status)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert defect: %v", err)
			return
		}
		defer rows.Close()
		rows.Next()
		var id int64
		err = rows.Scan(&id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert defect: %v", err)
			return
		}
		log.Printf("Inserted defect: %d", id)
		d.Id = id
		body, err = json.Marshal(d)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing defect: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
}

func getDefectByID(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM defects WHERE defects.id = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding defect: %v\n", err)
			return
		}
		defer rows.Close()
		if rows.Next() {
			var d defect
			err = rows.Scan(&d.Id, &d.Name, &d.Date, &d.Description, &d.Status)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding defect: %v\n", err)
				return
			}
			str, err := json.Marshal(d)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding defect: %v\n", err)
				return
			}
			writer.Header().Set("Content-Type", "application/json")
			writer.Write(str)
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf("Error finding defect: defect not found \n")
			return
		}
	}

}

func getDefects(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM defects")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
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
			log.Printf("Error finding defects: %v\n", err)
			return
		}
		str, err := json.Marshal(defects)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding defects: %v\n", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.Write(str)
	}
}

func createDefectsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS defects (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, date TIMESTAMP NOT NULL, description TEXT, status TEXT);")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
