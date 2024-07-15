package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
	"strconv"
	"slices"
)

func postVehicleImage2(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (picture, bool) {
	introspectionResult, err := introspect(writer, request)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusUnauthorized)
		return picture{}, true
	}
	if !slices.Contains(introspectionResult.Access.Roles, "employee") {
		http.Error(writer, "Access denied", http.StatusUnauthorized)
		return picture{}, true
	}

	p, fail := addImageToDB(writer, request, tx)
	if fail {
		return picture{}, true
	}
	result, err := tx.Exec(request.Context(), "INSERT INTO vehicleImage (vehicleId, imageId) VALUES ($1, $2);",
		mux.Vars(request)[idKey], p.Id)
	checkUpdateSingleRow(writer, err, result, "postDefectImage")
	return p, false
}

func deleteVehicleImage(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (picture, bool) {
	introspectionResult, err := introspect(writer, request)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusUnauthorized)
		return picture{}, true
	}
	if !slices.Contains(introspectionResult.Access.Roles, "employee") {
		http.Error(writer, "Access denied", http.StatusUnauthorized)
		return picture{}, true
	}

	result, err := tx.Exec(context.Background(),
		"DELETE FROM vehicleImage WHERE imageId = $1;", mux.Vars(request)["id"])
	if checkUpdateSingleRow(writer, err, result, "deleteVehicleImage") {
		return picture{}, true
	}
	image := deleteImage(writer, request, tx)
	return image, false
}

func getVehicleImagesByVehicleId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		ids, fail := getTs[id](writer, request, dbpool, "DefectImages",
			`SELECT images.id FROM vehicles
    			JOIN vehicleImage ON vehicles.id = vehicleImage.vehicleId 
    			JOIN images ON vehicleImage.imageId = images.id
             WHERE vehicles.id = $1
             ORDER BY images.displayorder`,
			mux.Vars(request)["id"])
		if fail {
			return
		}
		urls := make([]url, len(ids))
		for i := range ids {
			urls[i].URL = httpsPrefix + request.Host + fileAPIpath + strconv.FormatInt(ids[i].Id, 10)
		}

		returnTAsJSON(writer, urls, http.StatusOK)
	}
}
