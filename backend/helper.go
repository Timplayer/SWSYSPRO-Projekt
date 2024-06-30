package main

import (
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
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
