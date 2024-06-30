package main

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shopspring/decimal"
	"log"
	"net/http"
)

type vehicleType struct {
	Id              int64           `json:"id"`
	Name            string          `json:"name"`
	VehicleCategory int64           `json:"vehicleCategory"`
	Transmission    string          `json:"transmission"`
	MaxSeatCount    int64           `json:"maxSeatCount"`
	PricePerHour    decimal.Decimal `json:"pricePerHour"`
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
		var vC vehicleType
		err := dbpool.QueryRow(context.Background(), "SELECT * FROM vehicletypes WHERE vehicletypes.id = $1",
			mux.Vars(request)["id"]).Scan(&vC.Id, &vC.Name, &vC.VehicleCategory, &vC.Transmission, &vC.MaxSeatCount, &vC.PricePerHour)
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cVehicleType, cVehicleType)
			return
		}
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleType, err)
			return
		}
		returnTAsJSON(writer, vC, http.StatusOK)
	}
}

func getVehicleTypes(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM vehicleTypes;")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
		}
		defer rows.Close()

		vehicleTypes, err := pgx.CollectRows(rows, pgx.RowToStructByPos[vehicleType])

		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicle, err)
			return
		}
		str, err := json.Marshal(vehicleTypes)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicle, err)
			return
		}
		writer.Header().Set(contentType, applicationJSON)
		_, err = writer.Write(str)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicle, err)
			return
		}
	}
}

func sendResponseVehicleType(writer http.ResponseWriter, rows pgx.Rows, err error, s *vehicleType, operationType string, structName string) {
	rows.Next()
	var id int64
	err = rows.Scan(&id)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, operationType, structName, err)
		return
	}
	log.Printf(genericSuccess, operationType, structName, id)
	s.Id = id
	returnTAsJSON(writer, s, http.StatusCreated)
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
