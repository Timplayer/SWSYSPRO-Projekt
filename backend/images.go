package main

import (
	"bytes"
	"context"
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

func postImage(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (picture, bool) {
	p, fail := addImageToDB(writer, request, tx)
	if fail {
		return picture{}, true
	}
	return p, false
}

func getImageById(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (picture, bool) {
	p, fail := getT[picture](writer, request, tx, "getImageByID",
		"SELECT * FROM images WHERE id = $1", mux.Vars(request)["id"])
	if fail {
		return picture{}, true
	}
	var u = httpsPrefix + request.Host + fileAPIpath + strconv.FormatInt(p.Id, 10)
	p.URL = &u
	return p, false
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
		tx, err := dbpool.BeginTx(request.Context(), transactionOptionsReadOnly)
		if err != nil {
			return
		}
		//goland:noinspection GoUnhandledErrorResult
		defer tx.Rollback(request.Context())
		p, fail := getT[picture](writer, request, tx, "getImageByID",
			"SELECT * FROM images WHERE id = $1", mux.Vars(request)["id"])
		if fail {
			return
		}
		err = tx.Commit(request.Context())
		if err != nil {
			return
		}
		returnTAsJSON(writer, p.File, http.StatusOK)
	}
}

func getImages(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		p, fail := getTs[picture](writer, request, dbpool, "getImages",
			"SELECT * FROM images ORDER BY displayOrder;")
		if fail {
			return
		}
		for i := range p {
			var u = httpsPrefix + request.Host + fileAPIpath + strconv.FormatInt(p[i].Id, 10)
			p[i].URL = &u
		}
		returnTAsJSON(writer, p, http.StatusOK)
	}
}

func deleteImage(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) picture {
	p, _ := getT[picture](writer, request, tx, "", "DELETE FROM images WHERE id = $1 RETURNING *;", mux.Vars(request)["id"])
	return p
}

func createImagesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS images (id BIGSERIAL PRIMARY KEY, fileName TEXT, url TEXT, file bytea, displayOrder INTEGER)")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
