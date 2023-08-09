package services

import (
	"backend/Database"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

type UserData struct {
	UserId    string `bson:"uuid,omitempty"`
	Attempted []int  `bson:"attempted,omitempty"`
}

func AddAttemptedQuestion(email string, questionId string) {
	mongoClient := Database.ResolveClientDB()
	userDataCollection := mongoClient.Database("testing").Collection("userData")
	filter := bson.D{{"email", email}}
	update := bson.M{"$addToSet": bson.M{"attempted": questionId}}

	opts := options.Update().SetUpsert(true)

	_, err := userDataCollection.UpdateOne(context.TODO(), filter, update, opts)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Update (upsert) successful")
}
