package main

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
)

func createVehicleImageTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicleImage (vehicleId BIGSERIAL references vehicles(id), imageId BIGSERIAL references images(id))")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}

func createVehicleTypesImageTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicleTypesImage (vehicleTypeId BIGSERIAL references vehicleTypes(id), imageId BIGSERIAL references images(id))")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}

func createDefectImageTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS defectImage (defectId BIGSERIAL references defects(id), imageId BIGSERIAL references images(id))")
	if err != nil {
		log.Fatalf(failedToCreateTable, err)
	}
}
