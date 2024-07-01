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

type vehicle struct {
	Id              int64     `json:"id"`
	Name            string    `json:"name"`
	VehicleCategory int64     `json:"vehicleCategory"`
	Producer        int64     `json:"producer"`
	Status          string    `json:"status"`
	ReceptionDate   time.Time `json:"receptionDate"`
	CompletionDate  time.Time `json:"completionDate"`
}

func updateVehicle(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		v, fail := getRequestBody[vehicle](writer, request.Body)
		if fail {
			return
		}
		result, err := dbpool.Exec(context.Background(), "UPDATE vehicles SET name = $1, vehiclecategory = $2, producer = $3, status = $4, receptionDate = $5, completionDate = $6 WHERE id = $7", v.Name, v.VehicleCategory, v.Producer, v.Status, v.ReceptionDate, v.CompletionDate, v.Id)
		fail = checkUpdateSingleRow(writer, err, result, "update Vehicle")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cVehicle, v.Id)
		returnTAsJSON(writer, v, http.StatusCreated)
	}
}

func postVehicle(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		v, fail := getRequestBody[vehicle](writer, request.Body)
		if fail {
			return
		}
		err := dbpool.QueryRow(context.Background(),
			"INSERT INTO vehicles (name, vehicleCategory, producer, status, receptionDate, completionDate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;", v.Name, v.VehicleCategory, v.Producer, v.Status, v.ReceptionDate, v.CompletionDate).Scan(&v.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cVehicle, err)
			return
		}
		log.Printf(genericSuccess, insertOperation, cVehicle, v.Id)
		returnTAsJSON(writer, v, http.StatusCreated)
	}
}

func getVehicleById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		var v vehicle
		err := dbpool.QueryRow(context.Background(), "SELECT * FROM vehicles WHERE vehicles.id = $1;",
			mux.Vars(request)["id"]).Scan(&v.Id, &v.Name, &v.VehicleCategory, &v.Producer, &v.Status, &v.ReceptionDate, &v.CompletionDate)
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cVehicle, cVehicle)
			return
		}
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicle, err)
		}
		returnTAsJSON(writer, v, http.StatusOK)
	}
}

func getVehicles(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM vehicles;")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
		}
		defer rows.Close()
		vehicles, err := pgx.CollectRows(rows,
			func(row pgx.CollectableRow) (vehicle, error) {
				var v vehicle
				err := rows.Scan(&v.Id, &v.Name, &v.VehicleCategory, &v.Producer, &v.Status, &v.ReceptionDate, &v.CompletionDate)
				return v, err
			})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicle, err)
			return
		}
		returnTAsJSON(writer, vehicles, http.StatusOK)
	}
}

func createVehiclesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicles (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, vehicleCategory BIGSERIAL references vehiclecategories(id), producer BIGSERIAL references producers(id), status TEXT NOT NULL, receptionDate timestamp NOT NULL, completionDate timestamp);")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
