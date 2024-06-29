package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

func postVehicleCategoryImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return postImageGeneric(dbpool, "INSERT INTO vehicleCategoryImage (vehicleCategoryId, imageId) VALUES ($1, $2);")
}

func deleteVehicleCategoryImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(),
			"DELETE FROM vehicleCategoryImage WHERE imageId = $1;", mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing delete image: %v", err)
			return
		}
		defer rows.Close()
		rows, err = dbpool.Query(context.Background(),
			"DELETE FROM images WHERE id = $1 RETURNING images.id;", mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing delete image: %v", err)
			return
		}
		defer rows.Close()

		if rows.Next() {
			var p picture
			err = rows.Scan(&p.Id)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error deleting image: %p\n", err)
				return
			}
			str, err := json.Marshal(p)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error deleting image: %p\n", err)
				return
			}
			writer.Header().Set(contentType, applicationJSON)
			writer.WriteHeader(http.StatusOK)
			writer.Write(str)
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf("Error deleting image: image not found \n")
			return
		}
	}
}

func getVehicleCategoryImagesByVehicleCategoryId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return getImageGenericById(dbpool, "SELECT images.url FROM vehicleCategories JOIN vehicleCategoryImage ON vehicleCategories.id = vehicleCategoryImage.vehicleCategoryId JOIN images ON vehicleCategoryImage.imageId = images.id WHERE vehicleCategories.id = $1")
}
