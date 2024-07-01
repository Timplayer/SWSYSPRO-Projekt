package main

import (
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

func postVehicleImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		tx, err := dbpool.BeginTx(request.Context(), transactionOptionsRW)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorStartingTransaction, err)
			return
		}
		defer tx.Rollback(request.Context())

		p, fail := addImageToDB(writer, request, tx)
		if fail {
			return
		}
		result, err := tx.Exec(request.Context(), "INSERT INTO vehicleImage (vehicleId, imageId) VALUES ($1, $2);",
			mux.Vars(request)[idKey], p.Id)
		checkUpdateSingleRow(writer, err, result, "postDefectImage")

		tx.Commit(request.Context())
		log.Printf("Image inserted: %d", p.Id)
		returnTAsJSON(writer, p, http.StatusCreated)
	}
}

func deleteVehicleImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return deleteImageGeneric(dbpool, "DELETE FROM vehicleImage WHERE imageId = $1;")
}

func getVehicleImagesByVehicleId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		urls, fail := getTs[url](writer, request, dbpool, "DefectImages",
			`SELECT images.url FROM vehicles
    			JOIN vehicleImage ON vehicles.id = vehicleImage.vehicleId 
    			JOIN images ON vehicleImage.imageId = images.id
             WHERE vehicles.id = $1
             ORDER BY images.displayorder`,
			mux.Vars(request)["id"])
		if fail {
			return
		}

		returnTAsJSON(writer, urls, http.StatusOK)
	}
}
