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
	"strconv"
)

type picture struct {
	Id           int64  `json:"id"`
	FileName     string `json:"file_name"`
	URL          string `json:"url"`
	File         []byte `json:"file"`
	DisplayOrder int64  `json:"display_order"`
}

type url struct {
	URL string `json:"url"`
}

func checkFileType(fileType string) bool {
	log.Printf(fileType)
	if fileType != imageJPEG && fileType != imagePNG && fileType != imageGIF && fileType != imageWEBP && fileType != imageSVG {
		return true
	}
	return false
}

func postImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return postImageGeneric(dbpool, "")
}

func getImageById(dbpool *pgxpool.Pool) http.HandlerFunc {
	return getImageGenericById(dbpool, "SELECT url FROM images WHERE id = $1")
}

func postImageGeneric(dbpool *pgxpool.Pool, insertSQL string) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {

		err := request.ParseMultipartForm(1000) // maxMemory in MB
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error parsing multipart form: %v\n", err)
			return
		}

		var p picture

		p.DisplayOrder, err = strconv.ParseInt(request.FormValue(displayOrderKey), 10, 64)
		if err != nil {
			writer.WriteHeader(http.StatusBadRequest)
			log.Printf("Error parsing order number: %v\n", err)
			return
		}

		file, header, err := request.FormFile(formFileKey)
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

		wrongFileType := checkFileType(http.DetectContentType(buf.Bytes()))
		if wrongFileType {
			writer.WriteHeader(http.StatusUnsupportedMediaType)
			log.Printf("Unsupported Media Type\n")
			return
		}

		rows, err := dbpool.Query(context.Background(),
			"INSERT INTO images (fileName, file, displayOrder) VALUES ($1, $2, $3) RETURNING id;", header.Filename, buf.Bytes(), p.DisplayOrder)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cImage, err)
			return
		}
		defer rows.Close()
		rows.Next()
		err = rows.Scan(&p.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cImage, err)
			return
		}
		rows, err = dbpool.Query(context.Background(),
			"UPDATE images SET url = $1 WHERE id = $2;", httpsPrefix+request.Host+fileAPIpath+strconv.FormatInt(p.Id, 10), p.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, insertOperation, cImage, err)
			return
		}
		defer rows.Close()

		if (len(insertSQL) != 0) && (len(mux.Vars(request)[idKey]) != 0) {
			rows, err = dbpool.Query(context.Background(),
				insertSQL, mux.Vars(request)[idKey], p.Id)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf("Error creating connection: %v", err)
				return
			}
			defer rows.Close()
		}

		log.Printf("Image inserted: %d", p.Id)
		returnTAsJSON(writer, p, http.StatusCreated)
	}
}

func getImageGenericById(dbpool *pgxpool.Pool, selectSQL string) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), selectSQL, mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing get image by id: %v", err)
		}
		defer rows.Close()

		if rows.Next() {
			var u url
			err = rows.Scan(&u.URL)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorGetGenericById, cImage, err)
				return
			}
			returnTAsJSON(writer, u, http.StatusOK)
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cImage, cImage)
			return
		}
	}
}

func getImagesGenericById(dbpool *pgxpool.Pool, selectSQL string) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(request.Context(), selectSQL, mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error executing get image by id: %v", err)
		}

		urls, err := pgx.CollectRows(rows, pgx.RowToStructByPos[url])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorGetGenericById, cImage, err)
			return
		}

		returnTAsJSON(writer, urls, http.StatusOK)
	}
}

func getImageByIdAsFile(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT file FROM images WHERE id = $1;", mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorGetGenericById, cImage, err)
		}
		defer rows.Close()

		if rows.Next() {
			var p picture
			err = rows.Scan(&p.File)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorGetGenericById, cImage, err)
				return
			}
			writer.Header().Set(contentType, octetStream)
			writer.Write(p.File)
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf(errorGenericNotFound, cImage, cImage)
			return
		}
	}
}

func getImages(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(context.Background(), "SELECT images.url FROM images ORDER BY displayOrder;")
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error geting Database Connection: %v\n", err)
			return
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
			log.Printf(errorExecutingOperationGeneric, findingOperation, cImage, err)
			return
		}
		returnTAsJSON(writer, url, http.StatusOK)
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

		rows, err := dbpool.Query(context.Background(),
			"DELETE FROM images WHERE id = $1 RETURNING images.id;", mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorExecutingOperationGeneric, deleteOperation, cImage, err)
			return
		}
		defer rows.Close()

		if rows.Next() {
			var p picture
			err = rows.Scan(&p.Id)
			if err != nil {
				writer.WriteHeader(http.StatusInternalServerError)
				log.Printf(errorExecutingOperationGeneric, deleteOperation, cImage, err)
				return
			}
			returnTAsJSON(writer, p, http.StatusOK)
			return
		}

		if !rows.Next() {
			writer.WriteHeader(http.StatusNotFound)
			log.Printf("Error deleting image: image not found \n")
			return
		}
	}
}

func createImagesTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS images (id BIGSERIAL PRIMARY KEY, fileName TEXT, url TEXT, file bytea, displayOrder INTEGER)")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
