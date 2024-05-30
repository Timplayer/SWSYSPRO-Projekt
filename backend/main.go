package main

import (
	"context"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/zitadel/oidc/v3/pkg/client/rs"
	"github.com/zitadel/oidc/v3/pkg/oidc"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	provider := getOAuthProvider()

	router := mux.NewRouter()

	router.HandleFunc("/api/healthcheck/hello", hello()).Methods("GET")
	router.HandleFunc("/api/healthcheck/auth", validate(provider, func(writer http.ResponseWriter, request *http.Request, response *oidc.IntrospectionResponse) {
		hello()(writer, request)
	}))

	//start server
	log.Fatal(http.ListenAndServe(":80", router))
}

func getOAuthProvider() rs.ResourceServer {
	issuer, ok := os.LookupEnv("ISSUER")
	if !ok {
		log.Fatalf("ISSUER environment variable not set")
	}
	clientID, ok := os.LookupEnv("CLIENT_ID")
	if !ok {
		log.Fatalf("CLIENT_ID environment variable not set")
	}
	clientSecret, ok := os.LookupEnv("CLIENT_SECRET")
	if !ok {
		log.Fatalf("CLIENT_SECRET environment variable not set")
	}

	for i := 0; i < 10; i++ {
		provider, err := rs.NewResourceServerClientCredentials(
			context.TODO(), issuer, clientID, clientSecret)
		if err == nil {
			println("successfully initialized resource server")
			return provider
		}
		fmt.Printf("failed to initialize oauth provider client: %v", err)
		println("retrying after 5 seconds")
		time.Sleep(5 * time.Second)
	}
	log.Fatalf("failed to initialize oauth provider client")
	panic("")
}

func validate(provider rs.ResourceServer,
	handler func(writer http.ResponseWriter,
		request *http.Request,
		response *oidc.IntrospectionResponse)) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		auth := request.Header.Get("authorization")
		if auth == "" {
			http.Error(writer, "auth header missing", http.StatusUnauthorized)
			return
		}
		if !strings.HasPrefix(auth, oidc.PrefixBearer) {
			http.Error(writer, "invalid header", http.StatusUnauthorized)
			return
		}
		token := strings.TrimPrefix(auth, oidc.PrefixBearer)

		resp, err := rs.Introspect[*oidc.IntrospectionResponse](request.Context(), provider, token)
		if err != nil {
			http.Error(writer, err.Error(), http.StatusForbidden)
			return
		}

		handler(writer, request, resp)

	}

}

func hello() http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		writer.Write([]byte("hello world"))
	}
}
