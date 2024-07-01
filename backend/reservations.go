package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
	"slices"
	"time"
)

type reservation struct {
	Id           int64     `json:"id" db:"id"`
	UserId       string    `json:"-" db:"user_id"`
	StartZeit    time.Time `json:"start_zeit" db:"start_time"`
	StartStation int64     `json:"start_station" db:"start_pos"`
	EndZeit      time.Time `json:"end_zeit" db:"end_time"`
	EndStation   int64     `json:"end_station" db:"end_pos"`
	AutoKlasse   int64     `json:"auto_klasse" db:"auto_klasse"`
}

type reservationNullable struct {
	Id           int64      `json:"id" db:"id"`
	UserId       *string    `json:"-" db:"user_id"`
	StartZeit    *time.Time `json:"start_zeit" db:"start_time"`
	StartStation *int64     `json:"start_station" db:"start_pos"`
	EndZeit      *time.Time `json:"end_zeit" db:"end_time"`
	EndStation   *int64     `json:"end_station" db:"end_pos"`
	AutoKlasse   int64      `json:"auto_klasse" db:"auto_klasse"`
}

type availability struct {
	Time       time.Time `json:"time" db:"time"`
	Pos        int64     `json:"pos" db:"station"`
	AutoKlasse int64     `json:"auto_klasse" db:"auto_klasse"`
	Cars       int64     `json:"availability" db:"available"`
}

func postReservation(dbpool *pgxpool.Pool) func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
	return func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
		r, fail := getRequestBody[reservation](writer, request.Body)
		if fail {
			return
		}

		tx, err := dbpool.BeginTx(request.Context(), transactionOptions)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error starting transaction: %v", err)
			return
		}
		defer tx.Rollback(request.Context())

		r, fail = getT[reservation](writer, request, dbpool, "postReservation",
			"INSERT INTO reservations (user_id, auto_klasse, start_time, start_pos, end_time, end_pos) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
			introspectionResult.UserId, r.AutoKlasse, r.StartZeit, r.StartStation, r.EndZeit, r.EndStation)
		if fail {
			return
		}

		notAvailable := checkAvailability(writer, request, tx)
		if notAvailable {
			return
		}
		err = tx.Commit(request.Context())
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorTransactionAborted, err)
			return
		}

		log.Printf("added Reservation: %d", r.Id)
		returnTAsJSON(writer, r, http.StatusCreated)
	}
}

func putReservation(dbpool *pgxpool.Pool) func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
	return func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
		r, done := getRequestBody[reservation](writer, request.Body)
		if done {
			return
		}

		tx, err := dbpool.BeginTx(request.Context(), transactionOptions)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error starting transaction: %v", err)
			return
		}
		defer tx.Rollback(request.Context())

		result, err := tx.Exec(context.Background(),
			`UPDATE reservations
				 SET auto_klasse = $1,
				     start_time = $2,
				     start_pos = $3,
				     end_time = $4,
				     end_pos  = $5
                 WHERE id = $6 AND user_id = $7;`,
			r.AutoKlasse, r.StartZeit, r.StartStation, r.EndZeit, r.EndStation, r.Id, introspectionResult.UserId)
		if checkUpdateSingleRow(writer, err, result, "editing Reservation") {
			return
		}

		notAvailable := checkAvailability(writer, request, tx)
		if notAvailable {
			return
		}
		err = tx.Commit(request.Context())
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorTransactionAborted, err)
			return
		}

		log.Printf("edited Reservation: %d", r.Id)
		returnTAsJSON(writer, r, http.StatusAccepted)
	}
}

func getReservations(dbpool *pgxpool.Pool) func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
	return func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
		if slices.Contains(introspectionResult.Access.Roles, "employee") {
			reservations, fail := getTs[reservationNullable](writer, request, dbpool, "reservation",
				"Select * from reservations")
			if fail {
				return
			}
			returnTAsJSON(writer, reservations, http.StatusOK)
		} else {
			reservations, fail := getTs[reservationNullable](writer, request, dbpool, "reservation",
				"Select * from reservations WHERE user_id = $1", introspectionResult.UserId)
			if fail {
				return
			}
			returnTAsJSON(writer, reservations, http.StatusOK)
		}
	}
}

func deleteReservation(dbpool *pgxpool.Pool) func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
	return func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
		tx, err := dbpool.BeginTx(request.Context(), transactionOptions)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error starting transaction: %v", err)
			return
		}
		var result pgconn.CommandTag
		if slices.Contains(introspectionResult.Access.Roles, "employee") {
			result, err = dbpool.Exec(context.Background(),
				`Delete from Reservations
                     WHERE id = $1`, mux.Vars(request)["id"])
		} else {
			result, err = dbpool.Exec(context.Background(),
				`Delete from Reservations
                    WHERE user_id = $1 AND id = $2`, introspectionResult.UserId, mux.Vars(request)["id"])
		}

		if checkUpdateSingleRow(writer, err, result, "deleting Reservation") {
			return
		}

		notAvailable := checkAvailability(writer, request, tx)
		if notAvailable {
			return
		}
		err = tx.Commit(request.Context())
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error transaction Deleting Reservation aborted: %v", err)
			return
		}
		writer.WriteHeader(http.StatusOK)
	}
}

type stationAndTime struct {
	Id         int64     `json:"id"`
	Time       time.Time `json:"time"`
	Station    int64     `json:"station"`
	AutoKlasse int64     `json:"auto_klasse"`
}

func addCarToStation(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		r, fail := getRequestBody[stationAndTime](writer, request.Body)
		if fail {
			return
		}
		tx, err := dbpool.BeginTx(request.Context(), transactionOptions)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error starting transaction: %v", err)
			return
		}
		defer tx.Rollback(request.Context())

		res, fail := getT[reservationNullable](writer, request, dbpool, "postNewCar",
			"INSERT INTO reservations (auto_klasse, end_time, end_pos) VALUES ($1, $2, $3) RETURNING *",
			r.AutoKlasse, r.Time, r.Station)
		if fail {
			return
		}

		notAvailable := checkAvailability(writer, request, tx)
		if notAvailable {
			return
		}
		err = tx.Commit(request.Context())
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorTransactionAborted, err)
			return
		}

		log.Printf("added Reservation: %d", r.Id)
		returnTAsJSON(writer, res, http.StatusCreated)
	}
}

func getAvailabilityAtStation(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		availabilities, fail := getTs[availability](writer, request, dbpool, "availability", "SELECT * FROM availability WHERE station = $1",
			mux.Vars(request)["id"])
		if fail {
			return
		}
		returnTAsJSON(writer, availabilities, http.StatusOK)
	}
}

func checkAvailability(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) bool {
	var available int
	err := tx.QueryRow(request.Context(), "SELECT MIN(available) AS a FROM availability").Scan(&available)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error testing availability: %v", err)
		return true
	}
	if available < 0 {
		writer.WriteHeader(http.StatusConflict)
		log.Printf("Error testing availability: no cars available\n")
		return true
	}
	return false
}

func createReservationsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), `
CREATE TABLE IF NOT EXISTS reservations
(
    id              BIGSERIAL PRIMARY KEY,
    user_id         varchar,
    auto_klasse     BIGINT,
    start_time      timestamp,
    start_pos       BIGINT,
    end_time        timestamp,
    end_pos         BIGINT,
    CONSTRAINT FK_auto_klasse FOREIGN KEY (auto_klasse) REFERENCES vehicletypes (id),
    CONSTRAINT FK_start_pos FOREIGN KEY (start_pos) REFERENCES stations (id),
    CONSTRAINT FK_end_pos FOREIGN KEY (end_pos) REFERENCES stations (id)
);
CREATE OR REPLACE VIEW availability AS
WITH station_times AS (SELECT start_pos AS pos, start_time AS time, auto_klasse
                       FROM reservations
                       UNION
                       DISTINCT
                       SELECT end_pos, end_time, auto_klasse
                       FROM reservations),
     arivals AS (SELECT t.pos, t.time, t.auto_klasse, count(*) AS num
                 FROM station_times t
                          JOIN reservations r
                               ON t.pos = r.end_pos
                                   AND t.time >= r.end_time
                 GROUP BY t.pos, t.time, t.auto_klasse),
     depatures AS (SELECT t.pos, t.time, t.auto_klasse, count(*) AS num
                   FROM station_times t
                            JOIN reservations r ON r.start_pos = t.pos AND r.start_time = t.time
                   GROUP BY t.pos, t.time, t.auto_klasse)
SELECT t.pos AS station,
       t.time AS time,
       t.auto_klasse,
       (coalesce(a.num, 0) - coalesce(d.num, 0)) AS available
FROM station_times t
    LEFT JOIN arivals a
        ON a.time = t.time AND a.pos = t.pos AND a.auto_klasse = t.auto_klasse
    LEFT JOIN depatures d
        ON t.time = d.time AND t.pos = d.pos AND d.auto_klasse = d.auto_klasse;`)
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
