package main

import (
	"backend/helpers"
	"context"
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"io"
	"log"
	"net/http"
)

func checkBool(err bool) {
	if err == false {
		log.Fatal("Error")
	}
}

type LoginCheckResult struct {
	Verdict bool   `json:"verdict"`
	Message string `json:"message"`
}

func getUserFromDB(email string) (User, bool) {
	userCollection := client.Database("testing").Collection("users")
	result := userCollection.FindOne(context.TODO(), bson.D{{Key: "email", Value: email}})
	if result.Err() != nil {
		fmt.Println("No user found")
		return User{}, false
	}
	var user User
	err := result.Decode(&user)
	if err != nil {
		log.Fatal("Issue Decoding User")
		return User{}, false
	}
	return user, true
}

func checkLoginCredentials(email string, password string) LoginCheckResult {

	// GET USER FROM DB USING EMAIL
	user, errBool := getUserFromDB(email)
	checkBool(errBool)
	fmt.Println("checkLogin", 1)
	msg, err := json.Marshal(user)
	helpers.Check(err, "")
	fmt.Println("checkLogin", 2)
	var verdict = false
	if password == user.Password {
		verdict = true
	}

	return LoginCheckResult{
		Verdict: verdict,
		Message: string(msg),
	}
}

type LoginCheckBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type JWTToken struct {
	JWT   string `bson:"token,omitempty"`
	Email string `bson:"email,omitempty"`
}

func storeTokenInDB(token string, email string) bool {
	tokenCollection := client.Database("testing").Collection("jwtTokens")

	var JWTtoken = JWTToken{
		Email: email,
		JWT:   token,
	}
	result, err := tokenCollection.InsertOne(context.TODO(), JWTtoken)
	helpers.Check(err, "")
	if err != nil {
		return false
	}

	fmt.Print(result)
	return true
}

func setTokenCookie(w *http.ResponseWriter, token string) {
	http.SetCookie(*w, &http.Cookie{
		Name:  "token",
		Value: token,
	})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := io.ReadAll(r.Body)
	helpers.Check(err, "")

	var loginCheckBody LoginCheckBody
	err = json.Unmarshal(body, &loginCheckBody)
	helpers.Check(err, "")

	out := checkLoginCredentials(loginCheckBody.Email, loginCheckBody.Password)

	jsonOutput, err := json.Marshal(out)
	helpers.Check(err, "")

	// If Login is verified
	if out.Verdict == true {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"email": loginCheckBody.Email,
		})
		tokenString, err := token.SignedString([]byte("mysecret"))
		helpers.Check(err, "")

		setTokenCookie(&w, tokenString)
	} else {
		fmt.Print("Login Failed")
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "HELO",
		Value: "BULGA",
	})

	fmt.Fprintf(w, string(jsonOutput))
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	http.SetCookie(w, &http.Cookie{
		Name:  "token",
		Value: "",
	})
	var result = "{ \"verdict\" : \"Logout Success\" }"

	_, err := w.Write([]byte(result))
	helpers.Check(err, "")
}

func checkLoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var token string
	for _, val := range r.Cookies() {
		if val.Name == "token" {
			token = val.Value
		}
	}

	helpers.Printer("TOKEN:", token)

	output := make(map[string]string)

	if len(token) == 0 {
		output["result"] = "false"
		jsonOut, err := json.Marshal(output)
		helpers.Check(err, "")
		w.Write(jsonOut)
	}

	t, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return []byte("mysecret"), nil
	})

	if err != nil {
		w.Write([]byte("FAILURE"))
		return
	}

	if claims, ok := t.Claims.(jwt.MapClaims); ok && t.Valid {
		output["result"] = "true"
		output["email"] = fmt.Sprint(claims["email"])
	} else {
		output["result"] = "false"
	}
	jsonOutput, err := json.Marshal(output)
	helpers.Check(err, "")
	w.Write(jsonOutput)
}
