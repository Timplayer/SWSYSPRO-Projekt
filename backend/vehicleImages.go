package main

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

func postVehicleImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return postImageGeneric(dbpool, "INSERT INTO vehicleImage (vehicleId, imageId) VALUES ($1, $2);")
}

func deleteVehicleImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return deleteImageGeneric(dbpool, "DELETE FROM vehicleImage WHERE imageId = $1;")
}

func getVehicleImagesByVehicleId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return getImagesGenericById(dbpool, "SELECT images.url FROM vehicles JOIN vehicleImage ON vehicles.id = vehicleImage.vehicleId JOIN images ON vehicleImage.imageId = images.id WHERE vehicles.id = $1 ORDER BY images.displayorder")
}
