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
)

type vehicleCategory struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

func updateVehicleCategory(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Println(errorReadingRequestBody, err)
			return
		}
		var vC vehicleCategory
		err = json.Unmarshal(body, &vC)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorParsingRequestBody, err)
			return
		}
		rows, err := dbpool.Query(context.Background(), "UPDATE vehicleCategories SET name = $1 WHERE id = $2 RETURNING id;", vC.Name, mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error updating vehicleCategory: %vC\n", err)
			return
		}
		defer rows.Close()

		sendResponseVehicleCategories(writer, rows, err, vC, body, updateOperation, cVehicleCategory)
		return
	}
}

func postVehicleCategories(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorReadingRequestBody, err)
			return
		}
		var vC vehicleCategory
		err = json.Unmarshal(body, &vC)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorReadingRequestBody, err)
			return
		}
		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO vehicleCategories (name) VALUES ($1) RETURNING id", vC.Name)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert vehicleCategory: %v", err)
			return
		}
		defer rows.Close()

		sendResponseVehicleCategories(writer, rows, err, vC, body, insertOperation, cVehicleCategory)
		return
	}
}

func getVehicleCategoryById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM vehicleCategories WHERE vehicleCategories.id = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleCategory, err)
		}
		defer rows.Close()

		if rows.Next() {
			var vC vehicleCategory
			err = rows.Scan(&vC.Id, &vC.Name)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleCategory, err)
				return
			}
			str, err := json.Marshal(vC)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleCategory, err)
				return
			}
			writer.Header().Set(contentType, applicationJSON)
			_, err = writer.Write(str)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleCategory, err)
				return
			}
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cVehicleCategory, cVehicleCategory)
			return
		}
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
		str, err := json.Marshal(vehicleCategories)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleCategory, err)
			return
		}
		writer.Header().Set(contentType, applicationJSON)
		_, err = writer.Write(str)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cVehicleCategory, err)
			return
		}
	}
}

func sendResponseVehicleCategories(writer http.ResponseWriter, rows pgx.Rows, err error, vC vehicleCategory, body []byte, operationType string, structName string) bool {
	rows.Next()
	var id int64
	err = rows.Scan(&id)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, operationType, structName, err)
		return false
	}
	log.Printf(genericSuccess, operationType, structName, id)
	vC.Id = id
	body, err = json.Marshal(vC)
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

func createVehicleCategoriesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicleCategories (id BIGSERIAL PRIMARY KEY, name TEXT)")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
