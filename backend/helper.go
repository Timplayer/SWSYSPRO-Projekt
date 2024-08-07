package main

import (
	"encoding/json"
	"errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"net/http"
)

func getRequestBody[T any](writer http.ResponseWriter, requestBody io.ReadCloser) (T, bool) {
	var t T
	body, err := io.ReadAll(requestBody)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorReadingRequestBody, err)
		return t, true
	}
	err = json.Unmarshal(body, &t)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorReadingRequestBody, err)
		return t, true
	}
	return t, false
}

func returnTAsJSON[T any](writer http.ResponseWriter, t T, httpResponseCode int) {
	body, err := json.Marshal(t)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error serializing: %v", err)
		return
	}
	writer.Header().Set(contentType, applicationJSON)
	writer.WriteHeader(httpResponseCode)
	_, err = writer.Write(body)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error sending HTTP response: %v", err)
		return
	}
}

func checkUpdateSingleRow(writer http.ResponseWriter, err error, result pgconn.CommandTag, operation string) bool {
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error geting Database Connection: %v\n", err)
		return true
	}
	if result.RowsAffected() == 0 {
		writer.WriteHeader(http.StatusNotFound)
		log.Printf("Error %s: no reservations found", operation)
		return true
	}
	if result.RowsAffected() > 1 {
		log.Printf("Error %s: too many rows affected", operation)
	}
	return false
}

func getTs[T any](
	writer http.ResponseWriter,
	request *http.Request,
	dbpool *pgxpool.Pool,
	object string,
	sql string,
	args ...any) ([]T, bool) {
	rows, err := dbpool.Query(request.Context(), sql, args...)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorDatabaseConnection, err)
		return nil, true
	}
	defer rows.Close()
	t, err := pgx.CollectRows(rows, pgx.RowToStructByName[T])
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, findingOperation, object, err)
		return nil, true
	}
	return t, false
}

func getT[T any](
	writer http.ResponseWriter,
	request *http.Request,
	tx pgx.Tx,
	object string,
	sql string, args ...any) (T, bool) {
	var t T
	rows, err := tx.Query(request.Context(), sql, args...)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorDatabaseConnection, err)
		return t, true
	}
	defer rows.Close()
	t, err = pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[T])
	if errors.Is(err, pgx.ErrNoRows) {
		writer.WriteHeader(http.StatusNotFound)
		log.Printf(errorExecutingOperationGeneric, findingOperation, object, err)
		return t, true
	}
	if errors.Is(err, pgx.ErrTooManyRows) {
		log.Printf(errorExecutingOperationGeneric, findingOperation, object, err)
		return t, false
	}
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorExecutingOperationGeneric, findingOperation, object, err)
		return t, true
	}
	return t, false
}

func RestRequestWithTransaction[T any](
	dbpool *pgxpool.Pool, success int,
	fn func(writer http.ResponseWriter, request *http.Request, tx pgx.Tx) (T, bool)) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		tx, err := dbpool.BeginTx(request.Context(), transactionOptionsRW)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf(errorStartingTransaction, err)
			return
		}
		//goland:noinspection GoUnhandledErrorResult
		defer tx.Rollback(request.Context())

		t, done := fn(writer, request, tx)
		if done {
			return
		}

		err = tx.Commit(request.Context())
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			log.Printf("Could not commit Transaction: %v\n", err)
			return
		}
		returnTAsJSON(writer, t, success)
	}
}
