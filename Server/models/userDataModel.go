package models

import (
	"backend/database"
	"backend/helpers"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

type UserData struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	Attempted []string           `bson:"attempted" json:"attempted" `
	Email     string             `bson:"email,omitempty" json:"email" `
}

func AddAttemptedQuestion(email string, questionId string) bool {
	mongoClient := database.ResolveClientDB()
	userDataCollection := mongoClient.Database("testing").Collection("userData")
	filter := bson.D{{"email", email}}
	update := bson.M{"$addToSet": bson.M{"attempted": questionId}}

	opts := options.Update().SetUpsert(true)

	_, err := userDataCollection.UpdateOne(context.TODO(), filter, update, opts)
	if err != nil {
		log.Fatal(err)
		return false
	}

	fmt.Println("Update (upsert) successful")
	return true
}

func GetUserAttempted(email string) (UserData, bool) {
	mongoClient := database.ResolveClientDB()
	userDataCollection := mongoClient.Database("testing").Collection("userData")
	filter := bson.D{{Key: "email", Value: email}}

	result := userDataCollection.FindOne(context.TODO(), filter)

	var userData UserData

	if result.Err() != nil {
		fmt.Println("error: ", result.Err().Error())
		return userData, false
	}

	err := result.Decode(&userData)
	helpers.Check(err, "Decoding Response Data : GetUserAttempted")
	return userData, true
}
