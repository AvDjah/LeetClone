package main

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"net/http"
	"os/exec"
)

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

	// DB TEST HANDLERS
	http.HandleFunc("/addUser", addUserHandler)
	http.HandleFunc("/getUser", getUserHandler)

	// CODE RUNNING HANDLERS
	http.HandleFunc("/getProblem", getProblemHandler)
	http.HandleFunc("/runCode", runCodeHandler)

	// LOGIN HANDLERS
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/logout", logoutHandler)
	http.HandleFunc("/checkLogin", checkLoginHandler)

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}

}
