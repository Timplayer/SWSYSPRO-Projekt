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

type station struct {
	Id          int64   `json:"id"`
	Name        string  `json:"name"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Country     string  `json:"country"`
	State       string  `json:"state"`
	City        string  `json:"city"`
	Zip         string  `json:"zip"`
	Street      string  `json:"street"`
	HouseNumber string  `json:"house_number"`
}

func postStation(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		var s station
		err = json.Unmarshal(body, &s)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO stations (name, location, country, state, city, zip, street, houseNumber) VALUES ($1, point($2, $3), $4, $5, $6, $7, $8, $9) RETURNING id",
			s.Name)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing inserist station: %v", err)
			return
		}
		defer rows.Close()
		rows.Next()
		var id int64
		err = rows.Scan(&id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert station: %v", err)
			return
		}
		log.Printf("Inserted station: %d", id)
		s.Id = id
		body, err = json.Marshal(s)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing station: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
}

func getStationByID(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT stations.id, stations.name FROM stations WHERE stations.id = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding Stitions: %v\n", err)
			return
		}
		defer rows.Close()
		if rows.Next() {
			var s station
			err = rows.Scan(&s.Id, &s.Name)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding Stitions: %v\n", err)
				return
			}
			str, err := json.Marshal(s)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding Stitions: %v\n", err)
				return
			}
			writer.Header().Set("Content-Type", "application/json")
			writer.Write(str)
		}
	}

}

func getStations(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT stations.id, stations.name FROM stations")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
		}
		defer rows.Close()
		stations, err := pgx.CollectRows(rows,
			func(row pgx.CollectableRow) (station, error) {
				var s station
				err := rows.Scan(&s.Id, &s.Name)
				return s, err
			})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding Stations: %v\n", err)
			return
		}
		str, err := json.Marshal(stations)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding Stations: %v\n", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.Write(str)
	}
}

func createStationsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(),
		"CREATE TABLE IF NOT EXISTS stations(id BIGSERIAL PRIMARY KEY, name TEXT, location POINT, country TEXT, state TEXT, city TEXT, zip TEXT, street TEXT, houseNumber TEXT);")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
