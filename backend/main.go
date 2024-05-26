package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"log"
	"net/http"
	"strings"

	"github.com/zitadel/oidc/v3/pkg/client/rs"
	"github.com/zitadel/oidc/v3/pkg/oidc"
)

func main() {
	//keyPath := os.Getenv("KEY")
	issuer := "http://keycloak:8080/auth/realms/hivedrive"
	clientID := "go-backend"
	clientSecret := "B9BzwdWt0oFJZHfGgrammwW0THj380Ig"

	provider, err := rs.NewResourceServerClientCredentials(context.TODO(), issuer, clientID, clientSecret)
	if err != nil {
		logrus.Fatalf("error creating provider %s", err.Error())
	}

	//create router
	router := mux.NewRouter()
	//add routes
	router.HandleFunc("/api/test/hello", hello()).Methods("GET")
	router.HandleFunc("/api/test/auth", auth(provider)).Methods("GET")

	//start server
	log.Fatal(http.ListenAndServe(":80", router))
}

func hello() http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		writer.Write([]byte("hello world"))
	}
}

func auth(provider rs.ResourceServer) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ok, token := checkToken(w, r)
		if !ok {
			return
		}
		resp, err := rs.Introspect[*oidc.IntrospectionResponse](r.Context(), provider, token)
		if err != nil {
			http.Error(w, err.Error(), http.StatusForbidden)
			return
		}

		value, ok := resp.Claims["user_id"].(string)
		if !ok || value == "" {
			http.Error(w, "claim does not match", http.StatusForbidden)
			return
		}
		w.Write([]byte("authorized with value " + value))
	}

}

func checkToken(w http.ResponseWriter, r *http.Request) (bool, string) {
	auth := r.Header.Get("authorization")
	if auth == "" {
		http.Error(w, "auth header missing", http.StatusUnauthorized)
		return false, ""
	}
	if !strings.HasPrefix(auth, oidc.PrefixBearer) {
		http.Error(w, "invalid header", http.StatusUnauthorized)
		return false, ""
	}
	return true, strings.TrimPrefix(auth, oidc.PrefixBearer)
}
