package main

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

func postVehicleCategoryImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return postImageGeneric(dbpool, "INSERT INTO vehicleCategoryImage (vehicleCategoryId, imageId) VALUES ($1, $2);")
}

func deleteVehicleCategoryImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return deleteImageGeneric(dbpool, "DELETE FROM vehicleCategoryImage WHERE imageId = $1;")
}

func getVehicleCategoryImagesByVehicleCategoryId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return getImagesGenericById(dbpool, "SELECT images.url FROM vehicleCategories JOIN vehicleCategoryImage ON vehicleCategories.id = vehicleCategoryImage.vehicleCategoryId JOIN images ON vehicleCategoryImage.imageId = images.id WHERE vehicleCategories.id = $1 ORDER BY images.displayorder")
}
