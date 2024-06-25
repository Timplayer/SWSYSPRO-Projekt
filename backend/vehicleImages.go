package main

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"net/http"
	"strconv"
)

func postVehicleImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {

		var path string
		path = "/api/images/file/id/"

		err := request.ParseMultipartForm(1000) // maxMemory in MB
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error parsing multipart form: %v\n", err)
			return
		}

		file, header, err := request.FormFile("file")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error parsing file: %v\n", err)
			return
		}

		buf := bytes.NewBuffer(nil)
		if _, err := io.Copy(buf, file); err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading file: %v\n", err)
			return
		}

		var p picture
		p.DisplayOrder, err = strconv.ParseInt(request.FormValue("display_order"), 10, 64)
		if err != nil {
			writer.WriteHeader(http.StatusBadRequest)
			log.Printf("Error parsing order number: %v\n", err)
			return
		}

		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO images (fileName, file, displayOrder) VALUES ($1, $2, $3) RETURNING id;", header.Filename, buf.Bytes(), p.DisplayOrder)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert image: %v", err)
			return
		}
		defer rows.Close()

		rows.Next()
		err = rows.Scan(&p.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert image (rows.Scan): %v", err)
			return
		}
		_, err = dbpool.Query(context.Background(),
			"UPDATE images SET url = $1 WHERE id = $2;", "https://"+request.Host+path+strconv.FormatInt(p.Id, 10), p.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing update image: %v", err)
			return
		}

		_, err = dbpool.Query(context.Background(),
			"INSERT INTO vehicleImage (vehicleId, imageId) VALUES ($1, $2);", mux.Vars(request)["id"], p.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error creating connection: %v", err)
			return
		}

		var body []byte
		body, err = json.Marshal(p)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert image (json.Marshal): %v", err)
			return
		}

		log.Printf("Image inserted: %d", p.Id)
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
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
			writer.Header().Set("Content-Type", "application/json")
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
		writer.Header().Set("Content-Type", "application/json")
		writer.Write(str)
	}
}
