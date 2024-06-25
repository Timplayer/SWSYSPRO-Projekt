package main

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
)

type Connection struct {
	EntityId int64 `json:"entityId"`
	ImageId  int64 `json:"imageId"`
}

func createVehicleImageTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicleImage (vehicleId BIGSERIAL references vehicles(id), imageId BIGSERIAL references images(id))")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
