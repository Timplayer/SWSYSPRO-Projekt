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
	introspectionResult, err := introspect(writer, request)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusUnauthorized)
		return picture{}, true
	}

	if slices.Contains(introspectionResult.Access.Roles, "employee") {
		result, err := tx.Exec(context.Background(),
			"DELETE FROM defectImage WHERE imageId = $1;", mux.Vars(request)["id"])
		if checkUpdateSingleRow(writer, err, result, "deleteDefectImage") {
			err := tx.Rollback(request.Context())
			if err != nil {
				return picture{}, false
			}
			return picture{}, true
		}
		image := deleteImage(writer, request, tx)
		return image, false
	}

	return picture{}, false
}

func getDefectImagesByDefectId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		introspectionResult, err := introspect(writer, request)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusUnauthorized)
			return
		}

		if slices.Contains(introspectionResult.Access.Roles, "employee") {
			urls, fail := getTs[url](writer, request, dbpool, "DefectImages",
				`SELECT images.url FROM defects 
    			JOIN defectImage ON defects.id = defectImage.defectId
    			JOIN images ON defectImage.imageId = images.id 
            WHERE defects.id = $1 ORDER BY images.displayorder`,
				mux.Vars(request)["id"])
			if fail {
				return
			}
			returnTAsJSON(writer, urls, http.StatusOK)
		} else {
			urls, fail := getTs[url](writer, request, dbpool, "DefectImages",
				`SELECT images.url FROM defects 
    			JOIN defectImage ON defects.id = defectImage.defectId
    			JOIN images ON defectImage.imageId = images.id 
            WHERE defects.id = $1 and defects.userid = $2 ORDER BY images.displayorder`,
				mux.Vars(request)["id"], introspectionResult.UserId)
			if fail {
				return
			}
			returnTAsJSON(writer, urls, http.StatusOK)
		}
		urls := make([]url, len(ids))
		for i := range ids {
			urls[i].URL = httpsPrefix + request.Host + fileAPIpath + strconv.FormatInt(ids[i].Id, 10)
		}

		returnTAsJSON(writer, urls, http.StatusOK)
	}
}
