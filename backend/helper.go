package main

import (
	"encoding/json"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"net/http"
)

func startTransaction(writer http.ResponseWriter, request *http.Request, dbpool *pgxpool.Pool) (pgx.Tx, bool) {
	tx, err := dbpool.BeginTx(request.Context(), pgx.TxOptions{
		IsoLevel:       pgx.Serializable,
		AccessMode:     pgx.ReadWrite,
		DeferrableMode: pgx.NotDeferrable})
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error starting transaction: %v", err)
		return nil, true
	}
	return tx, false
}

func getRequestBody[T any](writer http.ResponseWriter, requestBody io.ReadCloser) (*T, bool) {
	body, err := io.ReadAll(requestBody)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorReadingRequestBody, err)
		return nil, true
	}
	var r *T
	err = json.Unmarshal(body, &r)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		log.Printf(errorReadingRequestBody, err)
		return nil, true
	}
	return r, false
}
