package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
	"slices"
)

type station struct {
	Id          int64   `json:"id" db:"id"`
	Name        string  `json:"name" db:"name"`
	Latitude    float64 `json:"latitude" db:"latitude"`
	Longitude   float64 `json:"longitude" db:"longitude"`
	Country     string  `json:"country" db:"country"`
	State       string  `json:"state" db:"state"`
	City        string  `json:"city" db:"city"`
	Zip         string  `json:"zip" db:"zip"`
	Street      string  `json:"street" db:"street"`
	HouseNumber string  `json:"house_number" db:"house_number"`
	Capacity    int64   `json:"capacity" db:"capacity"`
}

func updateStation(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		introspectionResult, err := introspect(writer, request)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusUnauthorized)
			return
		}
		if !slices.Contains(introspectionResult.Access.Roles, "employee") {
			http.Error(writer, "Access denied", http.StatusUnauthorized)
			return
		}
		s, fail := getRequestBody[station](writer, request.Body)
		if fail {
			return
		}
		result, err := dbpool.Exec(context.Background(),
			`UPDATE stations 
				 SET name = $1, location = point($2, $3), country = $4, state = $5, city = $6,
				     zip = $7, street = $8, houseNumber = $9, capacity = $10 
				 WHERE id = $11`,
			s.Name, s.Latitude, s.Longitude, s.Country, s.State, s.City, s.Zip,
			s.Street, s.HouseNumber, s.Capacity, s.Id)
		fail = checkUpdateSingleRow(writer, err, result, "update station")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cStation, s.Id)
		returnTAsJSON(writer, s, http.StatusCreated)
	}
}

func postStation(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (station, bool) {
	introspectionResult, err := introspect(writer, request)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusUnauthorized)
		return station{}, true
	}
	if !slices.Contains(introspectionResult.Access.Roles, "employee") {
		http.Error(writer, "Access denied", http.StatusUnauthorized)
		return station{}, true
	}

	s, fail := getRequestBody[station](writer, request.Body)
	if fail {
		return station{}, true
	}
	s, fail = getT[station](writer, request, tx, "postStation",
		`INSERT INTO stations (name, location, country, state, city, zip, street, houseNumber, capacity)
                   VALUES ($1, point($2, $3), $4  , $5   , $6  , $7 , $8    , $9         , $10)
        		RETURNING stations.id, stations.name, stations.location[0] as latitude,
        		          stations.location[1] as longitude, stations.country, stations.state, stations.city,
        		          stations.zip, stations.street, stations.houseNumber, stations.capacity`,
		s.Name, s.Latitude, s.Longitude, s.Country, s.State, s.City, s.Zip, s.Street, s.HouseNumber, s.Capacity)
	if fail {
		return station{}, true
	}
	return s, false
}

func getStationByID(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (station, bool) {
	s, fail := getT[station](writer, request, tx, "healthcheck",
		`SELECT stations.id,
                        stations.name,
                        stations.location[0] as latitude,
                        stations.location[1] as longitude,
                        stations.country,
                        stations.state,
                        stations.city,
                        stations.zip,
                        stations.street,
                        stations.houseNumber,
                        stations.capacity 
                  FROM stations WHERE stations.id = $1`,
		mux.Vars(request)["id"])
	if fail {
		return station{}, true
	}
	return s, false
}

func getStations(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		stations, fail := getTs[station](writer, request, dbpool, cStation,
			`SELECT stations.id, 
                        stations.name,
                        stations.location[0] as latitude,
                        stations.location[1] as longitude,
                        stations.country,
                        stations.state,
                        stations.city,
                        stations.zip,
                        stations.street,
                        stations.houseNumber,
                        stations.capacity
                  FROM stations;`)
		if fail {
			return
		}
		returnTAsJSON(writer, stations, http.StatusOK)
	}
}

func createStationsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS stations(
    			id BIGSERIAL PRIMARY KEY, name TEXT, location POINT, 
    			country TEXT, state TEXT, city TEXT, zip TEXT, street TEXT, 
    			houseNumber TEXT, capacity INTEGER);`)
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
		return
	}
}
