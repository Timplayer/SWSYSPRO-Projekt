package main

const contentType = "Content-Type"
const applicationJSON = "application/json"
const octetStream = "octet-stream"
const updateOperation = "update"
const insertOperation = "insert"
const findingOperation = "finding"
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

const genericSuccess = "%sed %s: %d"

const cDefect = "defect"
const cProducer = "producer"
const cStation = "station"
const cVehicle = "vehicle"
const cVehicleCategory = "vehicleCategory"
const cImage = "image"

const fileAPIpath = "/api/images/file/id/"
const displayOrderKey = "display_order"
const formFileKey = "file"
const httpsPrefix = "https://"
