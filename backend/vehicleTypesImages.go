package main

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

func postVehicleTypesImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return postImageGeneric(dbpool, "INSERT INTO vehicleTypesImage (vehicletypeid, imageId) VALUES ($1, $2);")
}

func deleteVehicleTypesImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return deleteImageGeneric(dbpool, "DELETE FROM vehicleTypesImage WHERE imageId = $1;")
}

func getVehicleTypesImagesByVehicleTypeId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return getImagesGenericById(dbpool,
		`SELECT images.url FROM vehicletypes 
    			  	JOIN vehicleTypesImage ON vehicletypes.id = vehicleTypesImage.vehicletypeid 
                  	JOIN images ON vehicleTypesImage.imageId = images.id 
                  	WHERE vehicleTypes.id = $1 ORDER BY images.displayorder`)
}
