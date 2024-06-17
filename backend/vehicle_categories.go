package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"net/http"
)

type vehicleCategoriy struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

func postVehicleCategories(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		var vC vehicleCategoriy
		err = json.Unmarshal(body, &vC)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO vehicle_categories (name) VALUES ($1) RETURNING id", vC.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert vehicle_category: %v", err)
			return
		}
		defer rows.Close()
		rows.Next()
		var id int64
		err = rows.Scan(&id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert vehicle_category: %v", err)
			return
		}
		log.Printf("Inserted vehicle_category: %d", id)
		vC.Id = id
		body, err = json.Marshal(vC)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing vehicle_category: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
}

func getVehicleCategoryById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM vehicle_categories WHERE vehicle_category_id = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding vehicle_categories: %v\n", err)
		}
		defer rows.Close()

		if rows.Next() {
			var vC vehicleCategoriy
			err = rows.Scan(&vC.Id, &vC.Name)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding vehicle_categories: %v\n", err)
				return
			}
			str, err := json.Marshal(vC)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding vehicle_categories: %v\n", err)
				return
			}
			writer.Header().Set("Content-Type", "application/json")
			writer.Write(str)
		}
	}
}

func createVehicleCategoriesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicle_categories (id serial PRIMARY KEY, name TEXT)")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
