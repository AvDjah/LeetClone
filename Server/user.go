package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
)

type User struct {
	Name     string `bson:"name,omitempty"`
	Email    string `bson:"email,omitempty"`
	Password string `bson:"password,omitempty"`
}

func addUser(user User, ch chan string) {

	userCollection := client.Database("testing").Collection("users")

	result, err := userCollection.InsertOne(context.TODO(), user)

	if err != nil {
		log.Print("addUser error: ", err)
		ch <- "Insert Error"
		return
	}
	fmt.Println("Added addUser: ", result)
	ch <- "Successfully Inserted"
}

func getUser(email string, ch chan string) {
	userCollection := client.Database("testing").Collection("users")
	result := userCollection.FindOne(context.TODO(), bson.D{{Key: "email", Value: email}})
	if result.Err() != nil {
		ch <- "Error getUser 1"
		return
	}
	var user User
	err := result.Decode(&user)
	if err != nil {
		ch <- "Error getUser 2"
		return
	}
	fmt.Println(user)
	ch <- "Success getUser"
}
