package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/zitadel/oidc/v3/pkg/oidc"
	"io"
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
	Active bool   `json:"active"`
	UserId string `json:"user_id"`
}

func main() {
	dbpool := getDBpool()
	defer dbpool.Close()

	initKeycloakConfig()

	router := mux.NewRouter()

	router.HandleFunc("/api/reservations", postReservation(dbpool)).Methods("POST")

	router.HandleFunc("/api/stations/id/{id}/availability", getAvailabilityAtStation(dbpool)).Methods("GET")
	router.HandleFunc("/api/stations/availability", addCarToStation(dbpool)).Methods("POST")

	router.HandleFunc("/api/stations", postStation(dbpool)).Methods("POST")
	router.HandleFunc("/api/stations", getStations(dbpool)).Methods("GET")
	router.HandleFunc("/api/stations/id/{id}", updateStation(dbpool)).Methods("PUT")

	router.HandleFunc("/api/images", postImage(dbpool)).Methods("POST")

	router.HandleFunc("/api/images/vehicles/id/{id}", postVehicleImage(dbpool)).Methods("POST")
	router.HandleFunc("/api/images/vehicles/id/{id}", getVehicleImagesByVehicleId(dbpool)).Methods("GET")
	router.HandleFunc("/api/images/vehicles/id/{id}", deleteVehicleImage(dbpool)).Methods("DELETE")

	router.HandleFunc("/api/images/vehicleCategories/id/{id}", postVehicleCategoryImage(dbpool)).Methods("POST")
	router.HandleFunc("/api/images/vehicleCategories/id/{id}", getVehicleCategoryImagesByVehicleCategoryId(dbpool)).Methods("GET")
	router.HandleFunc("/api/images/vehicleCategories/id/{id}", deleteVehicleCategoryImage(dbpool)).Methods("DELETE")

	router.HandleFunc("/api/images/defects/id/{id}", postDefectImage(dbpool)).Methods("POST")
	router.HandleFunc("/api/images/defects/id/{id}", getDefectImagesByDefectId(dbpool)).Methods("GET")
	router.HandleFunc("/api/images/defects/id/{id}", deleteDefectImage(dbpool)).Methods("DELETE")

	router.HandleFunc("/api/images", getImages(dbpool)).Methods("GET")                       // List of URLs
	router.HandleFunc("/api/images/id/{id}", getImageById(dbpool)).Methods("GET")            // URL
	router.HandleFunc("/api/images/file/id/{id}", getImageByIdAsFile(dbpool)).Methods("GET") // File

	router.HandleFunc("/api/vehicleCategories", postVehicleCategories(dbpool)).Methods("POST")
	router.HandleFunc("/api/vehicleCategories", getVehicleCategories(dbpool)).Methods("GET")
	router.HandleFunc("/api/vehicleCategories/id/{id}", updateVehicleCategory(dbpool)).Methods("PUT")

	router.HandleFunc("/api/vehicles", postVehicle(dbpool)).Methods("POST")
	router.HandleFunc("/api/vehicles", getVehicles(dbpool)).Methods("GET")
	router.HandleFunc("/api/vehicles/id/{id}", updateVehicle(dbpool)).Methods("PUT")

	router.HandleFunc("/api/defects", postDefect(dbpool)).Methods("POST")
	router.HandleFunc("/api/defects", getDefects(dbpool)).Methods("GET")
	router.HandleFunc("/api/defects/id/{id}", updateDefect(dbpool)).Methods("PUT")

	router.HandleFunc("/api/producers", postProducers(dbpool)).Methods("POST")
	router.HandleFunc("/api/producers", getProducers(dbpool)).Methods("GET")
	router.HandleFunc("/api/producers/id/{id}", updateProducer(dbpool)).Methods("PUT")

	router.HandleFunc("/api/stations/id/{id}", getStationByID(dbpool)).Methods("GET")
	router.HandleFunc("/api/vehicles/id/{id}", getVehicleById(dbpool)).Methods("GET")
	router.HandleFunc("/api/vehicleCategories/id/{id}", getVehicleCategoryById(dbpool)).Methods("GET")
	router.HandleFunc("/api/producers/id/{id}", getProducerById(dbpool)).Methods("GET")
	router.HandleFunc("/api/defects/id/{id}", getDefectByID(dbpool)).Methods("GET")

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
	createProducersTable(dbpool)
	createDefectsTable(dbpool)
	createVehiclesTable(dbpool) // depends on Producers and VehicleCategories

	createDefectImageTable(dbpool)
	createVehicleCategoryImageTable(dbpool)
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

		res, err := io.ReadAll(r.Body)
		if err != nil {
			log.Fatal(err)
		}

		var introspectionResult introspection
		err = json.Unmarshal(res, &introspectionResult)
		if err != nil {
			http.Error(writer, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		if !introspectionResult.Active {
			http.Error(writer, "Invalid Token", http.StatusUnauthorized)
			return
		}

		handler(writer, request, introspectionResult)
	}
}
