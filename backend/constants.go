package main

import (
	"github.com/jackc/pgx/v5"
	"time"
)

const dbPort = 5432
const dbTable = "hivedrive"
const psqlString = "host=%s port=%d user=%s password=%s dbname=%s sslmode=disable"

const contentType = "Content-Type"
const applicationJSON = "application/json"
const octetStream = "octet-stream"
const updateOperation = "update"
const findingOperation = "finding"
const failedToCreateTable = "Failed to create table: %v\n"

const imageJPEG = "image/jpeg"
const imagePNG = "image/png"
const imageSVG = "image/svg+xml"
const imageGIF = "image/gif"
const imageWEBP = "image/webp"

const errorReadingRequestBody = "Error reading request body: %v\n"
const errorExecutingOperationGeneric = "Error executing %s %s: %v"
const errorDatabaseConnection = "Error getting Database Connection: %v\n"
const errorTransactionAborted = "Error transaction aborted: %v"
const errorStartingTransaction = "Error starting transaction: %v"

const genericSuccess = "%sed %s: %d"
const idKey = "id"

const cDefect = "defect"
const cProducer = "producer"
const cStation = "station"
const cVehicle = "vehicle"
const cVehicleCategory = "vehicleCategory"
const cVehicleType = "vehicleType"

const fileAPIpath = "/api/images/file/id/"
const displayOrderKey = "display_order"
const formFileKey = "file"
const httpsPrefix = "https://"

const stationsAPIpath = "/api/stations"
const producersAPIpath = "/api/producers"
const vehiclesAPIpath = "/api/vehicles"
const vehicleCategoriesAPIpath = "/api/vehicleCategories"
const imagesAPIpath = "/api/images"
const imagesIdAPIpath = "/api/images/id/{id}"
const defectsAPIpath = "/api/defects"
const vehicleTypesAPIpath = "/api/vehicleTypes"
const reservationsAPIpath = "/api/reservations"

const stationsIdAPIpath = "/api/stations/id/{id}"
const defectsIdAPIpath = "/api/defects/id/{id}"
const producersIdAPIpath = "/api/producers/id/{id}"
const vehiclesIdAPIpath = "/api/vehicles/id/{id}"
const vehicleCategoriesIdAPIpath = "/api/vehicleCategories/id/{id}"
const vehicleTypesIdAPIpath = "/api/vehicleTypes/id/{id}"
const reservationsIdIdAPIpath = "/api/reservations/id/{id}"

const imagesVehicleAPIpath = "/api/images/vehicles/id/{id}"
const imagesDefectAPIpath = "/api/images/defects/id/{id}"
const imagesVehicleTypeAPIpath = "/api/images/vehicleTypes/id/{id}"
const imagesFilesIDAPIpath = "/api/images/file/id/{id}"

var transactionOptionsRW = pgx.TxOptions{
	IsoLevel:       pgx.Serializable,
	AccessMode:     pgx.ReadWrite,
	DeferrableMode: pgx.NotDeferrable}

var transactionOptionsReadOnly = pgx.TxOptions{
	IsoLevel:       pgx.Serializable,
	AccessMode:     pgx.ReadWrite,
	DeferrableMode: pgx.NotDeferrable}

var supportedFileTypes = []string{imageJPEG, imagePNG, imageGIF, imageWEBP, imageSVG}

const getImageByIdAsFileSQL = `SELECT images.* FROM images LEFT JOIN defectimage ON images.id = defectimage.imageid 
    			 LEFT JOIN defects ON defectimage.defectid = defects.id 
                 WHERE images.id = $1 and (defectid is NULL OR defects.user_id = $2 OR $3);`

const minReservationDuration = 10 * time.Minute
