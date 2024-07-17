package main

import (
	"github.com/jackc/pgx/v5"
	"time"
)

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

const postVehilceImageSQL = "INSERT INTO vehicleImage (vehicleId, imageId) VALUES ($1, $2);"
const deleteVehicleImageSQL = "DELETE FROM vehicleImage WHERE imageId = $1;"
const getVehicleImagesByVehicleIdSQL = "SELECT images.url FROM vehicles JOIN vehicleImage ON vehicles.id = vehicleImage.vehicleId JOIN images ON vehicleImage.imageId = images.id WHERE vehicles.id = $1 ORDER BY images.displayorder"

const postDefectImageSQL = "INSERT INTO defectImage (defectId, imageId) VALUES ($1, $2);"
const deleteDefectImageSQL = "DELETE FROM defectImage WHERE imageId = $1;"
const getDefectImagesByDefectIdSQL = "SELECT images.url FROM defects JOIN defectImage ON defects.id = defectImage.defectId JOIN images ON defectImage.imageId = images.id WHERE defect.id = $1 ORDER BY images.displayorder"

const postVehicleTypesImageSQL = "INSERT INTO vehicleTypesImage (vehicletypeid, imageId) VALUES ($1, $2);"
const deleteVehicleTypesImageSQL = "DELETE FROM vehicleTypesImage WHERE imageId = $1;"
const getVehicleTypesImagesByVehicleTypeIdSQL = "SELECT images.url FROM vehicletypes JOIN vehicleTypesImage ON vehicletypes.id = vehicleTypesImage.vehicletypeid JOIN images ON vehicleTypesImage.imageId = images.id WHERE vehicleTypes.id = $1 ORDER BY images.displayorder"

const minReservationDuration = 10 * time.Minute
