package main

const contentType = "Content-Type"
const applicationJSON = "application/json"
const updateOperation = "update"
const insertOperation = "insert"
const findingOperation = "finding"
const failedToCreateTable = "Failed to create table: %v\n"

const errorParsingRequestBody = "Error parsing request body: %v\n"
const errorReadingRequestBody = "Error reading request body: %v\n"
const errorSerializingGeneric = "Error serializing %s: %v"
const errorExecutingOperationGeneric = "Error executing %s %s: %v"
const errorDatabaseConnection = "Error geting Database Connection: %v\n"
const errorGenericNotFound = "Error finding %s: %s not found \n"

const genericSuccess = "%s ed %s: %d"

const cDefect = "defect"
const cProducer = "producer"
const cStation = "station"
const cVehicle = "vehicle"
const cVehicleCategory = "vehicleCategory"
