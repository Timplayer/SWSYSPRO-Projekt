package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
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
	DriverSystem    string          `json:"driverSystem" db:"driversystem"`
	MaxSeatCount    int64           `json:"maxSeatCount" db:"maxseatcount"`
	PricePerHour    decimal.Decimal `json:"pricePerHour" db:"priceperhour"`
	MinAgeToDrive   int64           `json:"minAgeToDrive" db:"minagetodrive"`
}

func updateVehicleType(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		s, fail := getRequestBody[vehicleType](writer, request.Body)
		if fail {
			return
		}

		rows, err := dbpool.Exec(context.Background(), "UPDATE vehicleTypes SET name = $1, vehicleCategory = $2, transmission = $3, driverSystem = $4, maxSeatCount = $5, pricePerHour = $6, minAgeToDrive = $7 WHERE id = $8",
			s.Name, s.VehicleCategory, s.Transmission, s.DriverSystem, s.MaxSeatCount, s.PricePerHour, s.MinAgeToDrive, s.Id)
		fail = checkUpdateSingleRow(writer, err, rows, "update VehicleTypes")
		if fail {
			return
		}
		log.Printf(genericSuccess, updateOperation, cVehicle, s.Id)
		returnTAsJSON(writer, s, http.StatusCreated)
	}
}

func postVehicleType(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (vehicleType, bool) {
	s, fail := getRequestBody[vehicleType](writer, request.Body)
	if fail {
		return vehicleType{}, true
	}
	s, fail = getT[vehicleType](writer, request, tx, "postVehicleType",
		`INSERT INTO vehicleTypes (name, vehicleCategory, transmission, driverSystem, maxSeatCount, pricePerHour, minAgeToDrive)
                               VALUES ($1  , $2             , $3          , $4          , $5          , $6          , $7)
                    RETURNING *`,
		s.Name, s.VehicleCategory, s.Transmission, s.DriverSystem, s.MaxSeatCount, s.PricePerHour, s.MinAgeToDrive)
	if fail {
		return vehicleType{}, true
	}
	return s, false
}

func getVehicleTypeById(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (vehicleType, bool) {
	vC, fail := getT[vehicleType](writer, request, tx, cDefect,
		"SELECT * FROM vehicletypes WHERE vehicletypes.id = $1",
		mux.Vars(request)["id"])
	if fail {
		return vehicleType{}, true
	}
	return vC, false
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
		`DO $$ 
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transmission') THEN
				CREATE TYPE transmission AS ENUM ('manual', 'automatic');
			END IF;

			IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driversystem') THEN
				CREATE TYPE driversystem AS ENUM ('fwd', 'rwd', 'awd');
			END IF;
		END$$;`)
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}

	_, err = dbpool.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS vehicleTypes (
			id BIGSERIAL PRIMARY KEY, 
			name TEXT NOT NULL, 
			vehicleCategory BIGSERIAL references vehiclecategories(id), 
			transmission transmission NOT NULL,
			driverSystem driversystem NOT NULL,
			maxSeatCount INTEGER,
			pricePerHour NUMERIC(9,2),
			minAgeToDrive INTEGER NOT NULL);`)

	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
