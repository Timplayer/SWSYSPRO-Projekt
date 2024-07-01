package main

import (
	"context"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/zitadel/oidc/v3/pkg/oidc"
	"log"
	"net/http"
	neturl "net/url"
	"os"
	"strings"
	"time"
)

var (
	keycloakRealm        string
	keycloakClientID     string
	keycloakClientSecret string
)

type introspection struct {
	Active bool        `json:"active"`
	UserId string      `json:"user_id"`
	Access realmAccess `json:"realm_access"`
}
type realmAccess struct {
	Roles []string `json:"roles"`
}

func main() {
	dbpool := getDBpool()
	defer dbpool.Close()

	initKeycloakConfig()

	router := mux.NewRouter()

	router.HandleFunc(reservationsAPIpath, validate(getReservations(dbpool))).Methods("GET")
	router.HandleFunc(reservationsAPIpath, validate(postReservation(dbpool))).Methods("POST")
	router.HandleFunc(reservationsIdIdAPIpath, validate(deleteReservation(dbpool))).Methods("DELETE")
	router.HandleFunc(reservationsAPIpath, validate(putReservation(dbpool))).Methods("PUT")

	router.HandleFunc("/api/stations/id/{id}/availability", getAvailabilityAtStation(dbpool)).Methods("GET")
	router.HandleFunc("/api/stations/availability", addCarToStation(dbpool)).Methods("POST")

	router.HandleFunc(stationsAPIpath, postStation(dbpool)).Methods("POST")
	router.HandleFunc(stationsAPIpath, getStations(dbpool)).Methods("GET")
	router.HandleFunc(stationsAPIpath, updateStation(dbpool)).Methods("PUT")

	router.HandleFunc(imagesAPIpath, postImage(dbpool)).Methods("POST")

	router.HandleFunc(imagesVehicleAPIpath, postVehicleImage(dbpool)).Methods("POST")
	router.HandleFunc(imagesVehicleAPIpath, getVehicleImagesByVehicleId(dbpool)).Methods("GET")
	router.HandleFunc(imagesVehicleAPIpath, deleteVehicleImage(dbpool)).Methods("DELETE")

	router.HandleFunc(imagesVehicleCategoryAPIpath, postVehicleTypesImage(dbpool)).Methods("POST")
	router.HandleFunc(imagesVehicleCategoryAPIpath, getVehicleTypesImagesByVehicleTypeId(dbpool)).Methods("GET")
	router.HandleFunc(imagesVehicleCategoryAPIpath, deleteVehicleTypesImage(dbpool)).Methods("DELETE")

	router.HandleFunc(imagesDefectAPIpath, postDefectImage(dbpool)).Methods("POST")
	router.HandleFunc(imagesDefectAPIpath, getDefectImagesByDefectId(dbpool)).Methods("GET")
	router.HandleFunc(imagesDefectAPIpath, deleteImageGeneric(dbpool, "DELETE FROM defectImage WHERE imageId = $1;")).Methods("DELETE")

	router.HandleFunc(imagesAPIpath, getImages(dbpool)).Methods("GET")                 // List of URLs
	router.HandleFunc(imagesIdAPIpath, getImageById(dbpool)).Methods("GET")            // URL
	router.HandleFunc(imagesFilesIDAPIpath, getImageByIdAsFile(dbpool)).Methods("GET") // File

	router.HandleFunc(vehicleCategoriesAPIpath, postVehicleCategories(dbpool)).Methods("POST")
	router.HandleFunc(vehicleCategoriesAPIpath, getVehicleCategories(dbpool)).Methods("GET")
	router.HandleFunc(vehicleCategoriesAPIpath, updateVehicleCategory(dbpool)).Methods("PUT")

	router.HandleFunc(vehicleTypesAPIpath, postVehicleType(dbpool)).Methods("POST")
	router.HandleFunc(vehicleTypesAPIpath, getVehicleTypes(dbpool)).Methods("GET")
	router.HandleFunc(vehicleTypesAPIpath, updateVehicleType(dbpool)).Methods("PUT")
	router.HandleFunc(vehicleTypesIdAPIpath, getVehicleTypeById(dbpool)).Methods("GET")

	router.HandleFunc(vehiclesAPIpath, postVehicle(dbpool)).Methods("POST")
	router.HandleFunc(vehiclesAPIpath, getVehicles(dbpool)).Methods("GET")
	router.HandleFunc(vehiclesAPIpath, updateVehicle(dbpool)).Methods("PUT")

	router.HandleFunc(defectsAPIpath, postDefect(dbpool)).Methods("POST")
	router.HandleFunc(defectsAPIpath, getDefects(dbpool)).Methods("GET")
	router.HandleFunc(defectsAPIpath, updateDefect(dbpool)).Methods("PUT")

	router.HandleFunc(producersAPIpath, postProducers(dbpool)).Methods("POST")
	router.HandleFunc(producersAPIpath, getProducers(dbpool)).Methods("GET")
	router.HandleFunc(producersAPIpath, updateProducer(dbpool)).Methods("PUT")

	router.HandleFunc(stationsIdAPIpath, getStationByID(dbpool)).Methods("GET")
	router.HandleFunc(vehiclesIdAPIpath, getVehicleById(dbpool)).Methods("GET")
	router.HandleFunc(vehicleCategoriesIdAPIpath, getVehicleCategoryById(dbpool)).Methods("GET")
	router.HandleFunc(producersIdAPIpath, getProducerById(dbpool)).Methods("GET")
	router.HandleFunc(defectsIdAPIpath, getDefectByID(dbpool)).Methods("GET")

	router.HandleFunc("/api/healthcheck/hello", hello()).Methods("GET")
	router.HandleFunc("/api/healthcheck/auth", validate(
		func(writer http.ResponseWriter, request *http.Request, introspectionResult introspection) {
			hello()(writer, request)
		}))
	router.HandleFunc("/api/healthcheck/sql", testDBget(dbpool)).Methods("GET")
	router.HandleFunc("/api/healthcheck/sql/{name}", testDBpost(dbpool)).Methods("POST")

	//start server
	log.Fatal(http.ListenAndServe(":80", router))
}

func getDBpool() *pgxpool.Pool {
	url, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		log.Fatal("DATABASE_URL environment variable not set")
	}
	port := 5432
	user, ok := os.LookupEnv("DATABASE_USER")
	if !ok {
		log.Fatal("DATABASE_USER environment variable not set")
	}
	password, ok := os.LookupEnv("DATABASE_PASS")
	if !ok {
		log.Fatal("DATABASE_PASS environment variable not set")
	}
	table := "hivedrive"

	psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", url, port, user, password, table)

	for i := 0; i < 10; i++ {
		dbpool, err := pgxpool.New(context.Background(), psqlconn)
		if err != nil {
			log.Fatal(err)
		}
		err = dbpool.Ping(context.Background())
		if err == nil {
			log.Println("Connected to database")
			initializeDatabase(dbpool)
			return dbpool
		}
		log.Printf("Unable to connect to database: %v\n", err)
		log.Printf("Waiting 5 seconds for database to become available")
		time.Sleep(5 * time.Second)
	}
	log.Fatal("Unable to connect to database")
	return nil
}

func initKeycloakConfig() {
	var ok bool
	keycloakClientID, ok = os.LookupEnv("CLIENT_ID")
	if !ok {
		log.Fatalf("CLIENT_ID environment variable not set")
	}

	keycloakClientSecret, ok = os.LookupEnv("CLIENT_SECRET")
	if !ok {
		log.Fatalf("CLIENT_SECRET environment variable not set")
	}
}

func initializeDatabase(dbpool *pgxpool.Pool) {
	_, err := dbpool.Exec(context.Background(),
		"CREATE TABLE IF NOT EXISTS test(id BIGSERIAL PRIMARY KEY, name TEXT)")

	if err != nil {
		log.Fatalf("Failed to create table: %v\n", err)
	}

	createImagesTable(dbpool)
	createStationsTable(dbpool)
	createVehicleCategoriesTable(dbpool)
	createVehicleTypesTable(dbpool)
	createProducersTable(dbpool)
	createDefectsTable(dbpool)
	createVehiclesTable(dbpool) // depends on Producers and VehicleCategories
	createDefectImageTable(dbpool)
	createVehicleTypesImageTable(dbpool)
	createVehicleImageTable(dbpool)
	createReservationsTable(dbpool)

}

func validate(
	handler func(writer http.ResponseWriter,
		request *http.Request,
		introspectionResult introspection)) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		auth := request.Header.Get("Authorization")
		if auth == "" {
			http.Error(writer, "Auth header missing", http.StatusUnauthorized)
			return
		}
		if !strings.HasPrefix(auth, oidc.PrefixBearer) {
			http.Error(writer, "invalid header", http.StatusUnauthorized)
			return
		}
		token := strings.TrimPrefix(auth, oidc.PrefixBearer)

		var urlValues neturl.Values
		urlValues = neturl.Values{"token": {token}}
		urlValues.Set("token_type_hint", "access_token")
		urlValues.Set("client_id", keycloakClientID)
		urlValues.Set("client_secret", keycloakClientSecret)

		r, _ := http.PostForm("http://keycloak:8080/auth/realms/hivedrive/protocol/openid-connect/token/introspect", urlValues)

		introspectionResult, fail := getRequestBody[introspection](writer, r.Body)
		if fail {
			return
		}
		if !introspectionResult.Active {
			http.Error(writer, "Invalid Token", http.StatusUnauthorized)
			return
		}

		handler(writer, request, introspectionResult)
	}
}
