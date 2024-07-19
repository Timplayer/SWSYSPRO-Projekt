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

type vehicleCategory struct {
	Id   int64  `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

func updateVehicleCategory(dbpool *pgxpool.Pool) http.HandlerFunc {
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

		vC, fail := getRequestBody[vehicleCategory](writer, request.Body)
		if fail {
			return
		}
		result, err := dbpool.Exec(context.Background(),
			"UPDATE vehicleCategories SET name = $1 WHERE id = $2;", vC.Name, vC.Id)
		fail = checkUpdateSingleRow(writer, err, result, "update vehicle category")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cVehicleCategory, vC.Id)
		returnTAsJSON(writer, vC, http.StatusCreated)
	}
}

func postVehicleCategories(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (vehicleCategory, bool) {
	introspectionResult, err := introspect(writer, request)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusUnauthorized)
		return vehicleCategory{}, true
	}
	if !slices.Contains(introspectionResult.Access.Roles, "employee") {
		http.Error(writer, "Access denied", http.StatusUnauthorized)
		return vehicleCategory{}, true
	}

	vC, fail := getRequestBody[vehicleCategory](writer, request.Body)
	if fail {
		return vehicleCategory{}, true
	}
	vC, fail = getT[vehicleCategory](writer, request, tx, "postVehicleCategorie",
		"INSERT INTO vehicleCategories (name) VALUES ($1) RETURNING *",
		vC.Name)
	if fail {
		return vehicleCategory{}, true
	}
	return vC, false
}

func getVehicleCategoryById(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (vehicleCategory, bool) {
	vC, fail := getT[vehicleCategory](writer, request, tx, cDefect,
		"SELECT * FROM vehicleCategories WHERE vehicleCategories.id = $1",
		mux.Vars(request)["id"])
	if fail {
		return vehicleCategory{}, true
	}
	return vC, false
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
	_, err := dbpool.Exec(context.Background(),
		"CREATE TABLE IF NOT EXISTS vehicleCategories (id BIGSERIAL PRIMARY KEY, name TEXT)")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
