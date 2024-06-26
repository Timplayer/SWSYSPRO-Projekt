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
)

type vehicleCategory struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

func updateVehicleCategory(w http.ResponseWriter, r *http.Request) {

}

func postVehicleCategories(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		var vC vehicleCategory
		err = json.Unmarshal(body, &vC)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO vehicleCategories (name) VALUES ($1) RETURNING id", vC.Name)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert vehicleCategory: %v", err)
			return
		}
		defer rows.Close()
		rows.Next()
		var id int64
		err = rows.Scan(&id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert vehicleCategory: %v", err)
			return
		}
		log.Printf("Inserted vehicleCategory: %d", id)
		vC.Id = id
		body, err = json.Marshal(vC)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing vehicleCategory: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
}

func getVehicleCategoryById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM vehicleCategories WHERE vehicleCategories.id = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding vehicleCategories: %v\n", err)
		}
		defer rows.Close()

		if rows.Next() {
			var vC vehicleCategory
			err = rows.Scan(&vC.Id, &vC.Name)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding vehicleCategories: %v\n", err)
				return
			}
			str, err := json.Marshal(vC)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding vehicleCategories: %v\n", err)
				return
			}
			writer.Header().Set("Content-Type", "application/json")
			writer.Write(str)
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf("Error finding vehicleCategory: vehicleCategory not found \n")
			return
		}
	}
}

func getVehicleCategories(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT vehicleCategories.id, vehicleCategories.name FROM vehicleCategories")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
		}
		defer rows.Close()
		vehicleCategories, err := pgx.CollectRows(rows,
			func(row pgx.CollectableRow) (vehicleCategory, error) {
				var vC vehicleCategory
				err := rows.Scan(&vC.Id, &vC.Name)
				return vC, err
			})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding vehicleCategories: %v\n", err)
			return
		}
		str, err := json.Marshal(vehicleCategories)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding vehicleCategories: %v\n", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.Write(str)
	}
}

func createVehicleCategoriesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicleCategories (id BIGSERIAL PRIMARY KEY, name TEXT)")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
