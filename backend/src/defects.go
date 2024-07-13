package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
	"slices"
	"time"
)

type defect struct {
	Id          int64     `json:"id" db:"id"`
	UserId      string    `json:"userId" db:"user_id"`
	Name        string    `json:"name" db:"name"`
	Date        time.Time `json:"date" db:"date"`
	Description string    `json:"description" db:"description"`
	Status      string    `json:"status" db:"status"`
}

func updateDefect(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		introspectionResult, err := introspect(writer, request)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusUnauthorized)
			return
		}

		d, fail := getRequestBody[defect](writer, request.Body)
		if fail {
			return
		}
		if slices.Contains(introspectionResult.Access.Roles, "employee") {
			result, err := dbpool.Exec(context.Background(),
				`UPDATE defects 
                    SET name = $1, date = $2, description = $3, status = $4 
                  WHERE id = $5`,
				d.Name, d.Date, d.Description, d.Status,
				d.Id)
			fail = checkUpdateSingleRow(writer, err, result, "update defect")
			if fail {
				return
			}
			log.Printf(genericSuccess, updateOperation, cDefect, d.Id)
			returnTAsJSON(writer, d, http.StatusCreated)
		} else {
			result, err := dbpool.Exec(context.Background(),
				`UPDATE defects 
                    SET name = $1, date = $2, description = $3, status = $4 
                  WHERE id = $5 AND user_id = $6`,
				d.Name, d.Date, d.Description, d.Status,
				d.Id, introspectionResult.UserId)
			fail = checkUpdateSingleRow(writer, err, result, "update defect")
			if fail {
				return
			}
			log.Printf(genericSuccess, updateOperation, cDefect, d.Id)
			returnTAsJSON(writer, d, http.StatusCreated)
		}

	}
}

func postDefect(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (defect, bool) {
	introspectionResult, err := introspect(writer, request)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusUnauthorized)
		return defect{}, true
	}

	d, fail := getRequestBody[defect](writer, request.Body)
	if fail {
		return defect{}, true
	}
	d, fail = getT[defect](writer, request, tx, "postDefect",
		"INSERT INTO defects (user_id, name, date, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
		introspectionResult.UserId, d.Name, d.Date, d.Description, d.Status)
	if fail {
		return defect{}, true
	}
	return d, false
}

func getDefectByID(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (defect, bool) {
	d, fail := getT[defect](writer, request, tx, cDefect,
		"SELECT * FROM defects WHERE defects.id = $1",
		mux.Vars(request)["id"])
	if fail {
		return defect{}, true
	}
	return d, false
}

func getDefects(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		defects, fail := getTs[defect](writer, request, dbpool, cDefect, "SELECT * FROM defects")
		if fail {
			return
		}
		returnTAsJSON(writer, defects, http.StatusOK)
	}
}

func createDefectsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS defects
              (id BIGSERIAL PRIMARY KEY,
               user_id TEXT,
               name TEXT NOT NULL,
               date TIMESTAMP NOT NULL,
               description TEXT, 
               status TEXT);`)
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
