package main

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
)

func createVehicleImageTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicleImage (vehicleId BIGSERIAL references vehicles(id), imageId BIGSERIAL references images(id))")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}

func createVehicleCategoryImageTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS vehicleCategoryImage (vehicleId BIGSERIAL references vehicleCategories(id), imageId BIGSERIAL references images(id))")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}

func createDefectImageTable(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS defectImage (vehicleId BIGSERIAL references defects(id), imageId BIGSERIAL references images(id))")
	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}
}
