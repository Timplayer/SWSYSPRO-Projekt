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

type vehicleCategory struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

func updateVehicleCategory(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		vC, fail := getRequestBody[vehicleCategory](writer, request.Body)
		if fail {
			return
		}
		result, err := dbpool.Exec(context.Background(), "UPDATE vehicleCategories SET name = $1 WHERE id = $2;", vC.Name, vC.Id)
		fail = checkUpdateSingleRow(writer, err, result, "update vehicle category")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cVehicleCategory, vC.Id)
		returnTAsJSON(writer, vC, http.StatusCreated)
	}
}

func postVehicleCategories(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		vC, fail := getRequestBody[vehicleCategory](writer, request.Body)
		if fail {
			return
		}
		err := dbpool.QueryRow(context.Background(),
			"INSERT INTO vehicleCategories (name) VALUES ($1) RETURNING id", vC.Name).Scan(&vC.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cVehicleCategory, err)
			return
		}
		log.Printf(genericSuccess, insertOperation, cVehicleCategory, vC.Id)
		returnTAsJSON(writer, vC, http.StatusCreated)
	}
}

func getVehicleCategoryById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		var vC vehicleCategory
		err := dbpool.QueryRow(context.Background(), "SELECT id, name FROM vehicleCategories WHERE vehicleCategories.id = $1",
			mux.Vars(request)["id"]).Scan(&vC.Id, &vC.Name)
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cVehicleCategory, cVehicleCategory)
			return
		}
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleCategory, err)
		}
		returnTAsJSON(writer, vC, http.StatusOK)
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
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleCategory, err)
			return
		}
		returnTAsJSON(writer, vehicleCategories, http.StatusOK)
	}
}

func createVehicleCategoriesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicleCategories (id BIGSERIAL PRIMARY KEY, name TEXT)")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
