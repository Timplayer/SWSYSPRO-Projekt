package main

import (
	"context"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	//"github.com/zitadel/oidc/v3/pkg/client/rs"
	//"github.com/zitadel/oidc/v3/pkg/oidc"
	"log"
	"net/http"
	"os"
	//"strings"
	"time"
)

var (
	keycloakRealm        string
	keycloakClientID     string
	keycloakClientSecret string
)

func main() {
	dbpool := getDBpool()
	defer dbpool.Close()

	initKeycloakConfig()
	client := gocloak.NewClient("http://keycloak:8080/auth/")

	router := mux.NewRouter()

	router.HandleFunc("/api/stations", postStation(dbpool)).Methods("POST")
	router.HandleFunc("/api/stations", getStations(dbpool)).Methods("GET")

	router.HandleFunc("/api/vehicleCategories", postVehicleCategories(dbpool)).Methods("POST")
	router.HandleFunc("/api/vehicleCategories", getVehicleCategories(dbpool)).Methods("GET")

	router.HandleFunc("/api/vehicles", postVehicle(dbpool)).Methods("POST")
	router.HandleFunc("/api/vehicles", getVehicles(dbpool)).Methods("GET")

	router.HandleFunc("/api/defects", postDefect(dbpool)).Methods("POST")
	router.HandleFunc("/api/defects", getDefects(dbpool)).Methods("GET")

	router.HandleFunc("/api/producers", postProducers(dbpool)).Methods("POST")
	router.HandleFunc("/api/producers", getProducers(dbpool)).Methods("GET")

	router.HandleFunc("/api/stations/id/{id}", getStationByID(dbpool)).Methods("GET")
	router.HandleFunc("/api/vehicles/id/{id}", getVehicleById(dbpool)).Methods("GET")
	router.HandleFunc("/api/vehicleCategories/id/{id}", getVehicleCategoryById(dbpool)).Methods("GET")
	router.HandleFunc("/api/producers/id/{id}", getProducerById(dbpool)).Methods("GET")
	router.HandleFunc("/api/defects/id/{id}", getDefectByID(dbpool)).Methods("GET")

	router.HandleFunc("/api/healthcheck/hello", hello()).Methods("GET")
	router.HandleFunc("/api/healthcheck/auth", validate(client,
		func(writer http.ResponseWriter, request *http.Request) {
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
	keycloakRealm = "hivedrive"

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
	createStationsTable(dbpool)
	createVehicleCategoriesTable(dbpool)
	createProducersTable(dbpool)
	createDefectsTable(dbpool)
	createVehiclesTable(dbpool) // depends on Producers and VehicleCategories
}

func validate(client *gocloak.GoCloak,
	handler func(writer http.ResponseWriter, request *http.Request)) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		auth := request.Header.Get("Authorization")
		if auth == "" {
			http.Error(writer, "Auth header missing", http.StatusUnauthorized)
			return
		}

		token := auth[len("Bearer "):]

		introspection, err := client.RetrospectToken(context.Background(), token, keycloakClientID, keycloakClientSecret, keycloakRealm)

		if err != nil {
			log.Printf("Token introspection error: %v", err)
			http.Error(writer, fmt.Sprintf("Token introspection error"), http.StatusUnauthorized)
			return
		}

		if !*introspection.Active {
			http.Error(writer, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		handler(writer, request)
	}
}
