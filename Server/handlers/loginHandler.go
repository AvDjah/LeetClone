package handlers

import (
	"backend/helpers"
	"backend/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := io.ReadAll(r.Body)
	helpers.Check(err, "Reading RegisterUser Body")

	var user models.User
	err = json.Unmarshal(body, &user)
	helpers.Check(err, "Unmarshalling RegisterUser Body")

	result, Err := user.Save()
	if Err == false {
		fmt.Println("Error when RegisterUser")
		return
	}

	fmt.Println(user, result)
}
