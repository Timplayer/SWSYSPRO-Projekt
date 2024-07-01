package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

type vehicleCategory struct {
	Id   int64  `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
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
		vC, fail = getT[vehicleCategory](writer, request, dbpool, "postVehicleCategorie",
			"INSERT INTO vehicleCategories (name) VALUES ($1) RETURNING *",
			vC.Name)
		if fail {
			return
		}
		log.Printf(genericSuccess, insertOperation, cVehicleCategory, vC.Id)
		returnTAsJSON(writer, vC, http.StatusCreated)
	}
}

func getVehicleCategoryById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		vC, fail := getT[vehicleCategory](writer, request, dbpool, cDefect,
			"SELECT * FROM vehicleCategories WHERE vehicleCategories.id = $1",
			mux.Vars(request)["id"])
		if fail {
			return
		}
		returnTAsJSON(writer, vC, http.StatusOK)
	}
}

func getVehicleCategories(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		vehicleCategories, fail := getTs[vehicleCategory](writer, request, dbpool, cVehicleCategory,
			"SELECT * FROM vehiclecategories")
		if fail {
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
