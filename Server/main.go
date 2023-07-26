package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os/exec"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func check(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	// Use the SetServerAPIOptions() method to set the Stable API version to 1
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	client := ResolveClientDB()

	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	fmt.Println("DB Connected")
	cmd := exec.Command("newgrp", "docker")
	err = cmd.Run()
	if err != nil {
		log.Panic(("Docker init error"))
	}
	http.HandleFunc("/", mainHandler)
	http.HandleFunc("/addUser", addUserHandler)
	http.HandleFunc("/getUser", getUserHandler)
	http.HandleFunc("/getProblem", getProblemHandler)
	http.HandleFunc("/runCode", runCodeHandler)
	// http.HandleFunc("/getUserList")

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}

}
