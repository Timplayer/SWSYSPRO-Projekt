package main

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

func postDefectImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return postImageGeneric(dbpool, "INSERT INTO defectImage (defectId, imageId) VALUES ($1, $2);")
}

func deleteDefectImage(dbpool *pgxpool.Pool) http.HandlerFunc {
	return deleteImageGeneric(dbpool, "DELETE FROM defectImage WHERE imageId = $1;")
}

func getDefectImagesByDefectId(dbpool *pgxpool.Pool) http.HandlerFunc {
	return getImagesGenericById(dbpool, "SELECT images.url FROM defects JOIN defectImage ON defects.id = defectImage.defectId JOIN images ON defectImage.imageId = images.id WHERE defect.id = $1 ORDER BY images.displayorder")
}
