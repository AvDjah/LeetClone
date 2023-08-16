package models

import (
	"backend/database"
	"backend/helpers"
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Name  string             `bson:"name,omitempty"`
	Email string             `bson:"email,omitempty"`
	Sub   string             `bson:"sub,omitempty"`
	ID    primitive.ObjectID `bson:"_id,omitempty"`
}

func (user User) Save() (string, bool) {
	userCollections := database.MongoClient.Database("testing").Collection("users")
	result, err := userCollections.InsertOne(context.TODO(), user)

	helpers.Check(err, "Inserting User")

	if err != nil {
		return err.Error(), false
	}

	return result.InsertedID.(primitive.ObjectID).String(), true
}

func GetUser(email string) (User, bool) {
	userCollection := database.MongoClient.Database("testing").Collection("users")

	result := userCollection.FindOne(context.TODO(), bson.D{{
		Key: "email", Value: email,
	}})

	var user User

	err := result.Decode(&user)
	helpers.Check(err, "Decoding User")

	if result.Err() != nil {
		return user, false
	}

	return user, true
}
