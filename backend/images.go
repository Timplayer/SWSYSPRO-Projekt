package main

import (
	"bytes"
	"context"
	"errors"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"net/http"
	"slices"
	"strconv"
)

type picture struct {
	Id           int64   `json:"id" db:"id"`
	FileName     string  `json:"file_name" db:"filename"`
	URL          *string `json:"url" db:"url"`
	File         []byte  `json:"-" db:"file"`
	DisplayOrder int64   `json:"display_order" db:"displayorder"`
}

type url struct {
	URL string `json:"url"`
}

func postImage(dbpool *pgxpool.Pool) http.HandlerFunc {
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
		tx.Commit(request.Context())
		log.Printf("Image inserted: %d", p.Id)
		returnTAsJSON(writer, p, http.StatusCreated)
	}
}

func getImageById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		tx, err := dbpool.BeginTx(request.Context(), transactionOptionsReadOnly)
		if err != nil {
			return
		}
		defer tx.Rollback(request.Context())
		p, fail := getT[picture](writer, request, tx, "getImageByID",
			"SELECT * FROM images WHERE id = $1", mux.Vars(request)["id"])
		if fail {
			return
		}
		var u = httpsPrefix + request.Host + fileAPIpath + strconv.FormatInt(p.Id, 10)
		p.URL = &u
		tx.Commit(request.Context())
		returnTAsJSON(writer, p, http.StatusOK)
	}
}

func addImageToDB(writer http.ResponseWriter, request *http.Request, dbpool pgx.Tx) (picture, bool) {
	err := request.ParseMultipartForm(1000) // maxMemory in MB
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error parsing multipart form: %v\n", err)
		return picture{}, true
	}

	file, header, err := request.FormFile(formFileKey)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error parsing file: %v\n", err)
		return picture{}, true
	}

	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error reading file: %v\n", err)
		return picture{}, true
	}

	if !slices.Contains(supportedFileTypes, http.DetectContentType(buf.Bytes())) {
		writer.WriteHeader(http.StatusUnsupportedMediaType)
		log.Printf("Unsupported Media Type\n")
		return picture{}, true
	}

	p, fail := getT[picture](writer, request, dbpool, "postImage",
		"INSERT INTO images (fileName, file, displayOrder) VALUES ($1, $2, $3) RETURNING *;",
		header.Filename, buf.Bytes(), request.FormValue(displayOrderKey))
	if fail {
		return p, true
	}
	return p, false
}

func getImageByIdAsFile(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		var p picture
		err := dbpool.QueryRow(context.Background(), "SELECT file FROM images WHERE id = $1;", mux.Vars(request)["id"]).Scan(&p.File)
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cImage, cImage)
			return
		} else if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorGetGenericById, cImage, err)
		}
		writer.Header().Set(contentType, octetStream)
		writer.Write(p.File)
	}
}

func getImages(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT * FROM images ORDER BY displayOrder;")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
		}
		defer rows.Close()

		p, err := pgx.CollectRows(rows, pgx.RowToStructByName[picture])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, findingOperation, cImage, err)
			return
		}
		for i := range p {
			var u = httpsPrefix + request.Host + fileAPIpath + strconv.FormatInt(p[i].Id, 10)
			p[i].URL = &u
		}
		returnTAsJSON(writer, p, http.StatusOK)
	}
}

func deleteImageGeneric(dbpool *pgxpool.Pool, deleteConnectionSQL string) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {

		if (len(deleteConnectionSQL) != 0) && (len(mux.Vars(request)[idKey]) != 0) {
			rows, err := dbpool.Query(context.Background(),
				deleteConnectionSQL, mux.Vars(request)["id"])
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, deleteOperation, cImage, err)
				return
			}
			defer rows.Close()
		}

		var p picture
		err := dbpool.QueryRow(context.Background(),
			"DELETE FROM images WHERE id = $1 RETURNING images.id;", mux.Vars(request)["id"]).Scan(&p.Id)
		if errors.Is(err, pgx.ErrNoRows) {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf("Error deleting image: image not found \n")
			return
		}
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, deleteOperation, cImage, err)
			return
		}
		returnTAsJSON(writer, p, http.StatusOK)
	}
}

func createImagesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS images (id BIGSERIAL PRIMARY KEY, fileName TEXT, url TEXT, file bytea, displayOrder INTEGER)")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
