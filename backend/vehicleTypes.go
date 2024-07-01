package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shopspring/decimal"
	"log"
	"net/http"
)

type vehicleType struct {
	Id              int64           `json:"id" db:"id"`
	Name            string          `json:"name" db:"name"`
	VehicleCategory int64           `json:"vehicleCategory" db:"vehiclecategory"`
	Transmission    string          `json:"transmission" db:"transmission"`
	MaxSeatCount    int64           `json:"maxSeatCount" db:"maxseatcount"`
	PricePerHour    decimal.Decimal `json:"pricePerHour" db:"priceperhour"`
}

func updateVehicleType(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		s, fail := getRequestBody[vehicleType](writer, request.Body)
		if fail {
			return
		}

		rows, err := dbpool.Exec(context.Background(), "UPDATE vehicleTypes SET name = $1, vehicleCategory = $2, transmission = $3, maxSeatCount = $4, pricePerHour = $5 WHERE id = $6",
			s.Name, s.VehicleCategory, s.Transmission, s.MaxSeatCount, s.PricePerHour, s.Id)
		fail = checkUpdateSingleRow(writer, err, rows, "update VehicleTypes")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cVehicle, s.Id)
		returnTAsJSON(writer, s, http.StatusCreated)
	}
}

func postVehicleType(dbpool *pgxpool.Pool) http.HandlerFunc {

	return func(writer http.ResponseWriter, request *http.Request) {
		s, fail := getRequestBody[vehicleType](writer, request.Body)
		if fail {
			return
		}

		err := dbpool.QueryRow(context.Background(),
			"INSERT INTO vehicleTypes (name, vehicleCategory, transmission, maxSeatCount, pricePerHour) VALUES ($1, $2, $3, $4, $5) RETURNING id",
			s.Name, s.VehicleCategory, s.Transmission, s.MaxSeatCount, s.PricePerHour).Scan(&s.Id)

		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cVehicleType, err)
			return
		}
		log.Printf(genericSuccess, insertOperation, cVehicleType, s.Id)
		returnTAsJSON(writer, s, http.StatusCreated)
	}
}

func getVehicleTypeById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		vC, fail := getT[vehicleType](writer, request, dbpool, cDefect,
			"SELECT * FROM vehicletypes WHERE vehicletypes.id = $1",
			mux.Vars(request)["id"])
		if fail {
			return
		}
		returnTAsJSON(writer, vC, http.StatusOK)
	}
}

func getVehicleTypes(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		vehicleTypes, fail := getTs[vehicleType](writer, request, dbpool, cVehicleType, "SELECT * FROM vehicletypes")
		if fail {
			return
		}
		returnTAsJSON(writer, vehicleTypes, http.StatusOK)
	}
}

func createVehicleTypesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS vehicleTypes (
			id BIGSERIAL PRIMARY KEY, 
			name TEXT NOT NULL, 
			vehicleCategory BIGSERIAL references vehiclecategories(id), 
			transmission TEXT NOT NULL,
			maxSeatCount INTEGER,
			pricePerHour NUMERIC(9,2));`)

	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
