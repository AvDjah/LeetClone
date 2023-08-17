package main

import (
	"backend/database"
	"backend/handlers"
	"backend/helpers"
	"backend/middleware"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"net/http"
	"strings"
)

var PgDB *sql.DB
var client *mongo.Client

func main() {
	// Use the SetServerAPIOptions() method to set the Stable API version to 1
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	client = database.ResolveClientDB()
	PgDB = database.GetPgConnection()
	database.PgClient = database.GetPgConnection()
	database.MongoClient = database.ResolveClientDB()

	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	fmt.Println("DB Connected")

	http.HandleFunc("/", mainHandler)

	// CODE RUNNING HANDLERS
	http.HandleFunc("/getProblem", getProblemHandler)
	http.HandleFunc("/runCode", runCodeHandler)

	//QUESTION HANDLERS
	http.HandleFunc("/getAllProblems", getAllProblemsHandler)
	//http.HandleFunc("/addAttempted", handlers.AddAttemptedHandler)
	//http.HandleFunc("/getAttempted", handlers.GetAttemptedHandler)
	http.HandleFunc("/getSelectedID", handlers.GetSelectedID)

	http.Handle("/getAttempted", middleware.EnsureValidToken()(http.HandlerFunc(handlers.GetAttemptedHandler)))
	http.Handle("/addAttempted", middleware.EnsureValidToken()(http.HandlerFunc(handlers.AddAttemptedHandler)))

	// LOGIN HANDLERS
	http.HandleFunc("/signUp", handlers.RegisterUser)
	http.HandleFunc("/getUser", handlers.GetUser)

	logger := middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// CORS Headers.
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")

			token := r.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
			fmt.Println("Token:", token)
			claims := token.CustomClaims.(*middleware.CustomClaims)
			result := strings.Split(claims.Scope, " ")

			fmt.Println("claims: ", result)
			mp := make(map[string]string)
			mp["Output"] = "Success"
			marshall, err := json.Marshal(mp)
			helpers.Check(err, "Marshalling map")
			w.Write(marshall)
		}),
	)

	http.Handle("/private", logger)

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}

}
