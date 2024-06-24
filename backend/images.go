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
)

type picture struct {
	Id       int64  `json:"id"`
	FileName string `json:"file_name"`
	File     []byte `json:"file"`
}

func postImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {

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

		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO images (fileName, file) VALUES ($1, $2) RETURNING id", header.Filename, buf.Bytes())
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing insert image: %v", err)
			return
		}
		defer rows.Close()

		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(nil)
	}
}

func getImageById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT id, fileName, file FROM images WHERE id = $1", mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing get image by id: %v", err)
		}
		defer rows.Close()

		if rows.Next() {
			var p picture
			err = rows.Scan(&p.Id, &p.FileName, &p.File)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error executing get image by id: %v", err)
				return
			}
			str, err := json.Marshal(p)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error executing get image by id: %v", err)
				return
			}
			writer.Header().Set("Content-Type", "application/json")
			writer.Write(str)
		}
	}
}

func getImages(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM images;")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
		}
		defer rows.Close()
		images, err := pgx.CollectRows(rows,
			func(row pgx.CollectableRow) (picture, error) {
				var p picture
				err := rows.Scan(&p.Id, &p.FileName, &p.File)
				return p, err
			})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding images: %v\n", err)
			return
		}
		str, err := json.Marshal(images)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error finding images: %v\n", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.Write(str)
	}
}

func createImagesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS images (id BIGSERIAL PRIMARY KEY, fileName TEXT, file bytea)")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
