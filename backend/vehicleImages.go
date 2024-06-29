package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

func postVehicleImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return postImageGeneric(dbpool, "INSERT INTO vehicleImage (vehicleId, imageId) VALUES ($1, $2);")
}

func deleteVehicleImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(),
			"DELETE FROM vehicleImage WHERE imageId = $1;", mux.Vars(request)["id"])
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

func getVehicleImagesByVehicleId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT images.url FROM vehicles JOIN vehicleImage ON vehicles.id = vehicleImage.vehicleId JOIN images ON vehicleImage.imageId = images.id WHERE vehicles.id = $1", mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing get image by id: %v", err)
		}
		defer rows.Close()

		url, err := pgx.CollectRows(rows,
			func(row pgx.CollectableRow) (url, error) {
				var u url
				err := rows.Scan(&u.URL)
				return u, err
			})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding images: %v\n", err)
			return
		}
		str, err := json.Marshal(url)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding images: %v\n", err)
			return
		}
		writer.Header().Set(contentType, applicationJSON)
		writer.Write(str)
	}
}
