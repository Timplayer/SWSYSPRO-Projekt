package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
	"strconv"
)

func postDefectImage(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (picture, bool) {
	_, err := introspect(writer, request)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusUnauthorized)
		return picture{}, true
	}

	p, fail := addImageToDB(writer, request, tx)
	if fail {
		return picture{}, true
	}
	result, err := tx.Exec(request.Context(), "INSERT INTO defectImage (defectId, imageId) VALUES ($1, $2);",
		mux.Vars(request)[idKey], p.Id)
	checkUpdateSingleRow(writer, err, result, "postDefectImage")
	return p, false
}

func deleteDefectImage(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (picture, bool) {
	result, err := tx.Exec(context.Background(),
		"DELETE FROM defectImage WHERE imageId = $1;", mux.Vars(request)["id"])
	if checkUpdateSingleRow(writer, err, result, "deleteDefectImage") {
		//goland:noinspection GoUnhandledErrorResult
		tx.Rollback(request.Context())
		return picture{}, true
	}
	image := deleteImage(writer, request, tx)
	return image, false
}

func getDefectImagesByDefectId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		ids, fail := getTs[id](writer, request, dbpool, "DefectImages",
			`SELECT images.id FROM defects 
    			JOIN defectImage ON defects.id = defectImage.defectId
    			JOIN images ON defectImage.imageId = images.id 
            WHERE defects.id = $1 ORDER BY images.displayorder`,
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
