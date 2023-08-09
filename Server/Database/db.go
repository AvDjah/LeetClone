package Database

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

var Client *mongo.Client
var PgClient *sql.DB

func ResolveClientDB() *mongo.Client {
	if Client != nil {
		return Client
	}

	var err error
	// TODO add to your .env.yml or .config.yml MONGODB_URI: mongodb://localhost:27017
	ClientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI"))
	Client, err = mongo.Connect(context.Background(), ClientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// check the connection
	err = Client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	// TODO optional you can log your connected MongoDB Client
	return Client
}

func CloseClientDB() {
	if Client == nil {
		return
	}

	err := Client.Disconnect(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	// TODO optional you can log your closed MongoDB Client
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
