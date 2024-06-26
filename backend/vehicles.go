package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
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
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Println("Error reading request body: %v\n", err)
			return
		}

		var v vehicle
		err = json.Unmarshal(body, &v)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error parsing request body: %v\n", err)
			return
		}
		rows, err := dbpool.Query(context.Background(), "UPDATE vehicles SET name = $1, vehiclecategory = $2, producer = $3, status = $4, receptionDate = $5, completionDate = $6 WHERE id = $7", v.Name, v.VehicleCategory, v.Producer, v.Status, v.ReceptionDate, v.CompletionDate, mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error updating vehicle: %v\n", err)
			return
		}
		defer rows.Close()

		sendResponseVehicles(writer, rows, err, v, body, updateOperation, cVehicle)
	}
}

func postVehicle(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing request body: %v\n", err)
			return
		}
		var v vehicle
		err = json.Unmarshal(body, &v)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO vehicles (name, vehicleCategory, producer, status, receptionDate, completionDate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;", v.Name, v.VehicleCategory, v.Producer, v.Status, v.ReceptionDate, v.CompletionDate)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert vehicle: %v", err)
			return
		}
		defer rows.Close()

		sendResponseVehicles(writer, rows, err, v, body, insertOperation, cVehicle)
		return
	}
}

func getVehicleById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM vehicles WHERE vehicles.id = $1;",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding vehicle: %v\n", err)
		}
		defer rows.Close()

		if rows.Next() {
			var v vehicle
			err = rows.Scan(&v.Id, &v.Name, &v.VehicleCategory, &v.Producer, &v.Status, &v.ReceptionDate, &v.CompletionDate)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding vehicle: %v\n", err)
				return
			}
			str, err := json.Marshal(v)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error finding vehicle: %v\n", err)
				return
			}
			writer.Header().Set(contentType, applicationJSON)
			_, err = writer.Write(str)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicle, err)
				return
			}
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf("Error finding vehicle: vehicle not found \n")
			return
		}
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
			log.Printf("Error finding vehicles: %v\n", err)
			return
		}
		str, err := json.Marshal(vehicles)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding vehicles: %v\n", err)
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

func sendResponseVehicles(writer http.ResponseWriter, rows pgx.Rows, err error, v vehicle, body []byte, operationType string, structName string) bool {
	rows.Next()
	var id int64
	err = rows.Scan(&id)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, operationType, structName, err)
		return false
	}
	log.Printf(genericSuccess, operationType, structName, id)
	v.Id = id
	body, err = json.Marshal(v)
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

func createVehiclesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicles (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, vehicleCategory BIGSERIAL references vehiclecategories(id), producer BIGSERIAL references producers(id), status TEXT NOT NULL, receptionDate timestamp NOT NULL, completionDate timestamp);")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
