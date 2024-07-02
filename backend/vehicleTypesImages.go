package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

func postVehicleTypesImage(dbpool *pgxpool.Pool) http.HandlerFunc {
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
		result, err := tx.Exec(request.Context(), "INSERT INTO vehicleTypesImage (vehicletypeid, imageId) VALUES ($1, $2);",
			mux.Vars(request)[idKey], p.Id)
		checkUpdateSingleRow(writer, err, result, "postDefectImage")

		tx.Commit(request.Context())
		log.Printf("Image inserted: %d", p.Id)
		returnTAsJSON(writer, p, http.StatusCreated)
	}
	//return postImageGeneric(dbpool, "INSERT INTO vehicleTypesImage (vehicletypeid, imageId) VALUES ($1, $2);")
}

func deleteVehicleTypesImage(dbpool *pgxpool.Pool) http.HandlerFunc {

	return func(writer http.ResponseWriter, request *http.Request) {
		tx, err := dbpool.BeginTx(request.Context(), transactionOptionsReadOnly)
		if err != nil {
			return
		}
		defer tx.Rollback(request.Context())

		result, err := tx.Exec(context.Background(),
			"DELETE FROM vehicleTypesImage WHERE imageId = $1;", mux.Vars(request)["id"])
		checkUpdateSingleRow(writer, err, result, "deleteVehicleTypesImage")
		image := deleteImage(writer, request, tx)

		tx.Commit(request.Context())
		returnTAsJSON(writer, image, http.StatusOK)
	}
}

func getVehicleTypesImagesByVehicleTypeId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		urls, fail := getTs[url](writer, request, dbpool, "DefectImages",
			`SELECT images.url FROM vehicletypes
				JOIN vehicleTypesImage ON vehicletypes.id = vehicleTypesImage.vehicletypeid
				JOIN images ON vehicleTypesImage.imageId = images.id
			 WHERE vehicleTypes.id = $1
			 ORDER BY images.displayorder`, mux.Vars(request)["id"])
		if fail {
			return
		}
		returnTAsJSON(writer, urls, http.StatusOK)
	}
}
