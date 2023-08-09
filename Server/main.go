package main

import (
	"backend/Database"
	"context"
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"net/http"
)

var PgDB *sql.DB
var client *mongo.Client

func main() {
	// Use the SetServerAPIOptions() method to set the Stable API version to 1
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	client = Database.ResolveClientDB()
	PgDB = Database.GetPgConnection()
	Database.PgClient = Database.GetPgConnection()
	Database.Client = Database.ResolveClientDB()

	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	fmt.Println("DB Connected")

	http.HandleFunc("/", mainHandler)

	// DB TEST HANDLERS
	http.HandleFunc("/addUser", addUserHandler)
	http.HandleFunc("/getUser", getUserHandler)

	// CODE RUNNING HANDLERS
	http.HandleFunc("/getProblem", getProblemHandler)
	http.HandleFunc("/runCode", runCodeHandler)

	//QUESTION HANDLERS
	http.HandleFunc("/getAllProblems", getAllProblemsHandler)
	http.HandleFunc("/addAttempted", addAttemptedHandler)

	// LOGIN HANDLERS
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/logout", logoutHandler)
	http.HandleFunc("/checkLogin", checkLoginHandler)

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}

}
