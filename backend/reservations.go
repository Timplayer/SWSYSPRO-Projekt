package main

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"net/http"
	"time"
)

type reservation struct {
	Id           int64     `json:"id"`
	StartZeit    time.Time `json:"start_zeit"`
	StartStation int64     `json:"start_station"`
	EndZeit      time.Time `json:"end_zeit"`
	EndStation   int64     `json:"end_station"`
	AutoKlasse   int64     `json:"auto_klasse"`
}

type availability struct {
	Time       time.Time `json:"time"`
	Pos        int64     `json:"pos"`
	AutoKlasse int64     `json:"auto_klasse"`
	Cars       int64     `json:"availability"`
}

func postReservation(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		var r reservation
		err = json.Unmarshal(body, &r)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}

		tx, err := dbpool.BeginTx(request.Context(), pgx.TxOptions{
			IsoLevel:       pgx.Serializable,
			AccessMode:     pgx.ReadWrite,
			DeferrableMode: pgx.NotDeferrable})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error starting Reservation transaction: %v", err)
			return
		}
		defer tx.Rollback(request.Context())

		err = tx.QueryRow(context.Background(),
			"INSERT INTO reservations (auto_klasse, start_time, start_pos, end_time, end_pos) VALUES ($1, $2, $3, $4, $5) RETURNING id",
			r.AutoKlasse, r.StartZeit, r.StartStation, r.EndZeit, r.EndStation).Scan(&r.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error adding Reservation: %v", err)
			return
		}

		// check if car is available
		var available int
		err = tx.QueryRow(request.Context(), "SELECT MIN(available) AS a FROM availability").Scan(&available)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error testing availability: %v", err)
			return
		}
		if available < 0 {
			writer.WriteHeader(http.StatusConflict)
			log.Printf("Error testing availability: no cars available, %v\n", r)
			return
		}
		err = tx.Commit(request.Context())
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error transaction aborted: %v", err)
			return
		}

		log.Printf("added Reservation: %d", r.Id)
		body, err = json.Marshal(r)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing station: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
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
		body, err := io.ReadAll(request.Body)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}
		var r stationAndTime
		err = json.Unmarshal(body, &r)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error reading request body: %v\n", err)
			return
		}

		tx, err := dbpool.BeginTx(request.Context(), pgx.TxOptions{
			IsoLevel:       pgx.Serializable,
			AccessMode:     pgx.ReadWrite,
			DeferrableMode: pgx.NotDeferrable})
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error starting Reservation transaction: %v", err)
			return
		}
		defer tx.Rollback(request.Context())

		err = tx.QueryRow(context.Background(),
			"INSERT INTO reservations (auto_klasse, end_time, end_pos) VALUES ($1, $2, $3) RETURNING id",
			r.AutoKlasse, r.Time, r.Station).Scan(&r.Id)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error adding Reservation: %v", err)
			return
		}

		// check if car is available
		var available int
		err = tx.QueryRow(request.Context(), "SELECT MIN(available) AS a FROM availability").Scan(&available)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error testing availability: %v", err)
			return
		}
		if available < 0 {
			writer.WriteHeader(http.StatusConflict)
			log.Printf("Error testing availability: no cars available, %v\n", r)
			return
		}
		err = tx.Commit(request.Context())
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error transaction aborted: %v", err)
			return
		}

		log.Printf("added Reservation: %d", r.Id)
		body, err = json.Marshal(r)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing station: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		writer.Write(body)
	}
}

func getAvailabilityAtStation(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		rows, err := dbpool.Query(request.Context(),
			"SELECT time, station, auto_klasse, available FROM availability WHERE station = $1",
			mux.Vars(request)["id"])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error querying availability cars: %v", err)
			return
		}
		a, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByPos[availability])
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error collecting availability cars: %v", err)
			return
		}
		body, err := json.Marshal(a)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Error serializing availability: %v", err)
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusOK)
		writer.Write(body)
	}
}

func createReservationsTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), `
CREATE TABLE IF NOT EXISTS reservations
(
    id              BIGSERIAL PRIMARY KEY,
    auto_klasse     BIGINT,
    start_time      timestamp,
    start_pos       BIGINT,
    end_time        timestamp,
    end_pos         BIGINT,
    CONSTRAINT FK_auto_klasse FOREIGN KEY (auto_klasse) REFERENCES vehiclecategories (id),
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
