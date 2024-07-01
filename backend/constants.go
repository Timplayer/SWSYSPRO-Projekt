package main

import "github.com/jackc/pgx/v5"

const contentType = "Content-Type"
const applicationJSON = "application/json"
const octetStream = "octet-stream"
const updateOperation = "update"
const insertOperation = "insert"
const findingOperation = "finding"
const deleteOperation = "delete"
const failedToCreateTable = "Failed to create table: %v\n"

const imageJPEG = "image/jpeg"
const imagePNG = "image/png"
const imageSVG = "image/svg+xml"
const imageGIF = "image/gif"
const imageWEBP = "image/webp"

const errorParsingRequestBody = "Error parsing request body: %v\n"
const errorReadingRequestBody = "Error reading request body: %v\n"
const errorSerializingGeneric = "Error serializing %s: %v"
const errorExecutingOperationGeneric = "Error executing %s %s: %v"
const errorDatabaseConnection = "Error getting Database Connection: %v\n"
const errorGenericNotFound = "Error finding %s: %s not found \n"
const errorGetGenericById = "Error getting %s by id %v\n"
const errorTransactionAborted = "Error transaction aborted: %v"

const genericSuccess = "%sed %s: %d"
const idKey = "id"

const cDefect = "defect"
const cProducer = "producer"
const cStation = "station"
const cVehicle = "vehicle"
const cVehicleCategory = "vehicleCategory"
const cImage = "image"
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
const imagesVehicleCategoryAPIpath = "/api/images/vehicleCategories/id/{id}"
const imagesFilesIDAPIpath = "/api/images/file/id/{id}"

var transactionOptions = pgx.TxOptions{
	IsoLevel:       pgx.Serializable,
	AccessMode:     pgx.ReadWrite,
	DeferrableMode: pgx.NotDeferrable}
