package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func ResolveClientDB() *mongo.Client {
	if client != nil {
		return client
	}

	var err error
	// TODO add to your .env.yml or .config.yml MONGODB_URI: mongodb://localhost:27017
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI"))
	client, err = mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// check the connection
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	// TODO optional you can log your connected MongoDB client
	return client
}

func CloseClientDB() {
	if client == nil {
		return
	}

	err := client.Disconnect(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	// TODO optional you can log your closed MongoDB client
	fmt.Println("Connection to MongoDB closed.")
}
