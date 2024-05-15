package main

import (
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	//create router
	router := mux.NewRouter()
	//add routes
	router.HandleFunc("/api/hello", hello()).Methods("GET")

	//start server
	log.Fatal(http.ListenAndServe(":80", router))
}

func hello() http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		writer.Write([]byte("hello world"))
	}
}
