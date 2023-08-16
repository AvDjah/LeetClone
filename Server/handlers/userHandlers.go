package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/services"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type GetUserRequest struct {
	Email string `json:"email"`
	Sub   string `json:"sub"`
}

type AddAttemptedQuestion struct {
	Email      string `json:"email"`
	QuestionID string `json:"questionID"`
	Sub        string `json:"sub"`
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := io.ReadAll(r.Body)
	helpers.Check(err, "Reading GetUser Body")

	var req GetUserRequest
	err = json.Unmarshal(body, &req)
	helpers.Check(err, "Unmarshalling Request Body : GetUser")

	var user models.User
	user, Err := models.GetUser(req.Email)

	if Err == false {
		fmt.Println("No user found")
		return
	}
	jsonOut, err := json.Marshal(user)
	helpers.Check(err, "Marshalling user : GetUser")
	w.Write(jsonOut)
}

func AddAttemptedHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := io.ReadAll(r.Body)
	helpers.Check(err, "Reading Request Body: AddAttemptedHandler")

	var addQuestion AddAttemptedQuestion
	err = json.Unmarshal(body, &addQuestion)
	helpers.Check(err, "Unmarshalling Question Body : AddAttemptedHandler")

	result := models.AddAttemptedQuestion(addQuestion.Email, addQuestion.QuestionID)

	if result == false {
		w.Write([]byte("Failure"))
		return
	}

	w.Write([]byte("Success"))
}

func GetAttemptedHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := r.URL.Query()
	var email string
	email = params["email"][0]

	var userData models.UserData
	userData, Err := models.GetUserAttempted(email)

	result := make(map[string]string)

	if Err == false {
		result["result"] = "Failure"
		marshalled, err := json.Marshal(result)
		helpers.Check(err, "marshalling Map : GetAttemptedHandler")
		w.Write(marshalled)
		return
	}

	marshalled, err := json.Marshal(userData)
	helpers.Check(err, "Marshalling UserData to Json: GetAttemptedHandler")
	w.Write(marshalled)
}

type QuestionsRequest struct {
	IDs []string `json:"ids"`
}

func GetSelectedID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := io.ReadAll(r.Body)
	helpers.Check(err, "Reading Body")

	var questionRequest QuestionsRequest
	err = json.Unmarshal(body, &questionRequest)
	helpers.Check(err, "Unmarshalling")

	questions := services.GetProblemWithIds(questionRequest.IDs)
	jsonOut, err := json.Marshal(questions)
	helpers.Check(err, "Marshalling Result Questions")

	w.Write(jsonOut)

}
