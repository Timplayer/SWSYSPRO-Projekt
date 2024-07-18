package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
	"slices"
	"time"
)

type vehicle struct {
	Id              int64     `json:"id" db:"id"`
	Name            string    `json:"name" db:"name"`
	VehicleCategory int64     `json:"vehicleCategory" db:"vehiclecategory"`
	Producer        int64     `json:"producer" db:"producer"`
	Status          string    `json:"status" db:"status"`
	ReceptionDate   time.Time `json:"receptionDate" db:"receptiondate"`
	CompletionDate  time.Time `json:"completionDate" db:"completiondate"`
}

func updateVehicle(dbpool *pgxpool.Pool) http.HandlerFunc {
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

		v, fail := getRequestBody[vehicle](writer, request.Body)
		if fail {
			return
		}
		result, err := dbpool.Exec(context.Background(),
			`UPDATE vehicles 
				 SET name = $1, vehiclecategory = $2, producer = $3, status = $4, receptionDate = $5, completionDate = $6 
				 WHERE id = $7`, v.Name, v.VehicleCategory, v.Producer, v.Status, v.ReceptionDate, v.CompletionDate, v.Id)
		fail = checkUpdateSingleRow(writer, err, result, "update Vehicle")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cVehicle, v.Id)
		returnTAsJSON(writer, v, http.StatusCreated)
	}
}

func postVehicle(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (vehicle, bool) {
	introspectionResult, err := introspect(writer, request)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusUnauthorized)
		return vehicle{}, true
	}
	if !slices.Contains(introspectionResult.Access.Roles, "employee") {
		http.Error(writer, "Access denied", http.StatusUnauthorized)
		return vehicle{}, true
	}

	v, fail := getRequestBody[vehicle](writer, request.Body)
	if fail {
		return vehicle{}, true
	}
	v, fail = getT[vehicle](writer, request, tx, "postVehicle",
		`INSERT INTO vehicles (name, vehicleCategory, producer, status, receptionDate, completionDate)
                               VALUES ($1  , $2             , $3      , $4    , $5           , $6)
                               RETURNING *;`,
		v.Name, v.VehicleCategory, v.Producer, v.Status, v.ReceptionDate, v.CompletionDate)
	if fail {
		return vehicle{}, true
	}
	return v, false
}

func getVehicleById(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (vehicle, bool) {
	v, fail := getT[vehicle](writer, request, tx, cDefect,
		"SELECT * FROM vehicles WHERE vehicles.id = $1;",
		mux.Vars(request)["id"])
	if fail {
		return vehicle{}, true
	}
	return v, false
}

func getVehicles(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		vehicles, fail := getTs[vehicle](writer, request, dbpool, cVehicle, "SELECT * FROM vehicles")
		if fail {
			return
		}
		returnTAsJSON(writer, vehicles, http.StatusOK)
	}
}

func createVehiclesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS vehicles (
    			id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, 
    			vehicleCategory BIGSERIAL references vehiclecategories(id), 
    			producer BIGSERIAL references producers(id), status TEXT NOT NULL, 
    			receptionDate timestamp NOT NULL, completionDate timestamp);`)
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
