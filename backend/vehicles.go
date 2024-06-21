package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"net/http"
	"time"
)

type vehicle struct {
	Id            int64     `json:"id"`
	Name          string    `json:"name"`
	ReceptionDate time.Time `json:"receptionDate"`
	Status        string    `json:"status"`
}

func updateVehicle(w http.ResponseWriter, r *http.Request) {

}

func postVehicle(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		var v vehicle
		err = json.Unmarshal(body, &v)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO vehicles (name, receptionDate, status) VALUES ($1) RETURNING id", v.Name, v.ReceptionDate, v.Status)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert vehicle: %v", err)
			return
		}
		defer rows.Close()
		rows.Next()
		var id int64
		err = rows.Scan(&id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert vehicle: %v", err)
			return
		}
		log.Printf("Inserted vehicle: %d", id)
		v.Id = id
		body, err = json.Marshal(v)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing vehicle: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
}

func getVehicleById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM vehicles WHERE vehicles.id = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding vehicle: %v\n", err)
		}
		defer rows.Close()

		if rows.Next() {
			var v vehicle
			err = rows.Scan(&v.Id, &v.Name, &v.ReceptionDate, &v.Status)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding vehicle: %v\n", err)
				return
			}
			str, err := json.Marshal(v)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding vehicle: %v\n", err)
				return
			}
			writer.Header().Set("Content-Type", "application/json")
			writer.Write(str)
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf("Error finding vehicle: vehicle not found \n")
			return
		}
	}
}
