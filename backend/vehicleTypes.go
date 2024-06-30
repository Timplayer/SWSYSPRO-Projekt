package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shopspring/decimal"
	"io"
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
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Println(errorReadingRequestBody, err)
			return
		}

		var s vehicleType
		err = json.Unmarshal(body, &s)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error parsing request body: %s\n", err)
			return
		}

		rows, err := dbpool.Query(context.Background(), "UPDATE vehicleTypes SET name = $1, vehicleCategory = $2, transmission = $3, maxSeatCount = $4, pricePerHour = $5 WHERE id = $6 RETURNING id",
			s.Name, s.VehicleCategory, s.Transmission, s.MaxSeatCount, s.PricePerHour, mux.Vars(request)["id"])

		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error updating vehicleType: %s\n", err)
			return
		}
		defer rows.Close()

		sendResponseVehicleType(writer, rows, err, s, body, updateOperation, cVehicle)
		return
	}
}

func postVehicleType(dbpool *pgxpool.Pool) http.HandlerFunc {

	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorReadingRequestBody, err)
			return
		}
		var s vehicleType
		err = json.Unmarshal(body, &s)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorReadingRequestBody, err)
			return
		}

		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO vehicleTypes (name, vehicleCategory, transmission, maxSeatCount, pricePerHour) VALUES ($1, $2, $3, $4, $5) RETURNING id",
			s.Name, s.VehicleCategory, s.Transmission, s.MaxSeatCount, s.PricePerHour)

		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cVehicleType, err)
			return
		}
		defer rows.Close()

		sendResponseVehicleType(writer, rows, err, s, body, insertOperation, cVehicleType)
		return
	}
}

func getVehicleTypeById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM vehicletypes WHERE vehicletypes.id = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleType, err)
		}
		defer rows.Close()

		if rows.Next() {
			var vC vehicleType
			err = rows.Scan(&vC.Id, &vC.Name, &vC.VehicleCategory, &vC.Transmission, &vC.MaxSeatCount, &vC.PricePerHour)

			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleType, err)
				return
			}
			str, err := json.Marshal(vC)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleType, err)
				return
			}
			writer.Header().Set(contentType, applicationJSON)
			_, err = writer.Write(str)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleType, err)
				return
			}
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cVehicleType, cVehicleType)
			return
		}
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

func sendResponseVehicleType(writer http.ResponseWriter, rows pgx.Rows, err error, s vehicleType, body []byte, operationType string, structName string) bool {
	rows.Next()
	var id int64
	err = rows.Scan(&id)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, operationType, structName, err)
		return false
	}
	log.Printf(genericSuccess, operationType, structName, id)
	s.Id = id
	body, err = json.Marshal(s)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorSerializingGeneric, err, structName)
		return false
	}
	writer.Header().Set(contentType, applicationJSON)
	writer.WriteHeader(http.StatusCreated)
	_, err = writer.Write(body)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, operationType, structName, err)
		return false
	}
	return false
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
