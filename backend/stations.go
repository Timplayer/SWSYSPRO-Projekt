package main

import (
	"context"
	"errors"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
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
	Capacity    int64   `json:"capacity"`
}

func updateStation(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		s, fail := getRequestBody[station](writer, request.Body)
		if fail {
			return
		}
		result, err := dbpool.Exec(context.Background(), "UPDATE stations SET name = $1, location = point($2, $3), country = $4, state = $5, city = $6, zip = $7, street = $8, houseNumber = $9, capacity = $10 WHERE id = $11", s.Name, s.Latitude, s.Longitude, s.Country, s.State, s.City, s.Zip, s.Street, s.HouseNumber, s.Capacity, s.Id)
		fail = checkUpdateSingleRow(writer, err, result, "update station")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cStation, s.Id)
		returnTAsJSON(writer, s, http.StatusCreated)
	}
}

func postStation(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		s, fail := getRequestBody[station](writer, request.Body)
		if fail {
			return
		}
		err := dbpool.QueryRow(context.Background(),
			"INSERT INTO stations (name, location, country, state, city, zip, street, houseNumber, capacity) VALUES ($1, point($2, $3), $4, $5, $6, $7, $8, $9, $10) RETURNING id",
			s.Name, s.Latitude, s.Longitude, s.Country, s.State, s.City, s.Zip, s.Street, s.HouseNumber, s.Capacity).Scan(&s.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cStation, err)
			return
		}
		log.Printf(genericSuccess, insertOperation, cStation, s.Id)
		returnTAsJSON(writer, s, http.StatusCreated)
		return
	}
}

func getStationByID(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		var s station
		err := dbpool.QueryRow(context.Background(), "SELECT stations.id, stations.name, stations.location[0] as latitude, stations.location[1] as longitude, stations.country, stations.state, stations.city, stations.zip, stations.street, stations.houseNumber, stations.capacity FROM stations WHERE stations.id = $1",
			mux.Vars(request)["id"]).Scan(&s.Id, &s.Name, &s.Latitude, &s.Longitude, &s.Country, &s.State, &s.City, &s.Zip, &s.Street, &s.HouseNumber, &s.Capacity)
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cStation, cStation)
			return
		}
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cStation, err)
			return
		}
		returnTAsJSON(writer, s, http.StatusOK)
	}

}

func getStations(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT stations.id, stations.name, stations.location[0] as latitude, stations.location[1] as longitude, stations.country, stations.state, stations.city, stations.zip, stations.street, stations.houseNumber, stations.capacity FROM stations;")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
		}
		defer rows.Close()
		stations, err := pgx.CollectRows(rows,
			func(row pgx.CollectableRow) (station, error) {
				var s station
				err := rows.Scan(&s.Id, &s.Name, &s.Latitude, &s.Longitude, &s.Country, &s.State, &s.City, &s.Zip, &s.Street, &s.HouseNumber, &s.Capacity)
				return s, err
			})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cStation, err)
			return
		}
		returnTAsJSON(writer, stations, http.StatusOK)
	}
}

func createStationsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(),
		"CREATE TABLE IF NOT EXISTS stations(id BIGSERIAL PRIMARY KEY, name TEXT, location POINT, country TEXT, state TEXT, city TEXT, zip TEXT, street TEXT, houseNumber TEXT, capacity INTEGER);")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
