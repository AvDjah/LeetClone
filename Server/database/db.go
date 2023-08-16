package database

import (
	"backend/helpers"
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client
var PgClient *sql.DB

func ResolveClientDB() *mongo.Client {
	if MongoClient != nil {
		return MongoClient
	}

	var err error
	// TODO add to your .env.yml or .config.yml MONGODB_URI: mongodb://localhost:27017
	ClientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI"))
	MongoClient, err = mongo.Connect(context.Background(), ClientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// check the connection
	err = MongoClient.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	// TODO optional you can log your connected MongoDB MongoClient
	return MongoClient
}

func CloseClientDB() {
	if MongoClient == nil {
		return
	}

	err := MongoClient.Disconnect(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	// TODO optional you can log your closed MongoDB MongoClient
	fmt.Println("Connection to MongoDB closed.")
}

const (
	host   = "db.eglrbextonyjgrhubvjv.supabase.co"
	port   = 5432
	user   = "postgres"
	dbname = "postgres"
)

func GetPgConnection() *sql.DB {

	var password = os.Getenv("POSTGRES_PASSWORD")

	if PgClient != nil {
		return PgClient
	}

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	helpers.Check(err, "POSTGRES_CONNECTION_OPEN")
	//defer db.Close()

	err = db.Ping()
	helpers.Check(err, "PING_POSTGRES_SERVER")
	fmt.Println("POSTGRES CONNECTED")
	PgClient = db
	return PgClient
}
