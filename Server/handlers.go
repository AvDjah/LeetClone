package main

import (
	"backend/helpers"
	"backend/services"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func mainHandler(w http.ResponseWriter, r *http.Request) {
	_, err := fmt.Fprintln(w, "Heelo")
	helpers.Check(err, "")
}

type Problem struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func readCSV() *csv.Reader {
	file, err := os.ReadFile("./LeetCodeData/data.csv")
	if err != nil {
		log.Fatal(err)
	}
	out := csv.NewReader(strings.NewReader(string(file)))
	return out
}

func parseProblem(id int, problem []string) Problem {
	out := Problem{
		Id:          id,
		Title:       problem[1],
		Description: problem[2],
	}
	return out
}

func getProblem(reader *csv.Reader, id int) ([]byte, bool) {
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatal("Error Reading records: ", err)
	}

	for _, data := range records {
		currId, err := strconv.Atoi(data[0])
		if err != nil {
			fmt.Println("Invalid ID: ", data[0], "->", err)
			continue
		}
		if currId == id {
			out := parseProblem(id, data)
			marshall, err := json.Marshal(out)
			if err != nil {
				log.Fatal("Error Marshalling : getProblem:  ", err)
			}
			return marshall, true
		}
	}
	return []byte{}, false
}

func getProblemHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")

	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal("Error 1 : getProblemHandler: ,", err)
	}
	problemId, err := strconv.Atoi(string(body))
	if err != nil {
		fmt.Println("Invalid ID: ", err)
		return
	}
	fmt.Println("Received problemId: ", problemId)

	file := readCSV()
	find, result := getProblem(file, problemId)
	if result == false {
		w.WriteHeader(406)
		_, err := w.Write([]byte("{}"))
		if err != nil {
			return
		}
	}
	w.Write(find)

}

type CodeOutput struct {
	Verdict bool   `json:"verdict"`
	Output  string `json:"output"`
}

func runFile() []byte {

	ans := services.RunCommands()
	return ans
}

func runCodeHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")

	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal("Error reading body : runCodeHandler: -> ", err)
	}
	code := string(body)
	fmt.Println(code)
	err = os.WriteFile("./Code/main.py", body, 0644)
	helpers.Check(err, "")
	output := runFile()
	codeOutput := CodeOutput{
		Verdict: true,
		Output:  string(output),
	}
	marshalled, err := json.Marshal(codeOutput)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(marshalled), string(output))
	_, err = fmt.Fprintln(w, string(marshalled))
}

func getAllProblemsHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	fmt.Println("getAllProblemsHandler")

	params := r.URL.Query()
	offset, err := strconv.Atoi(params["offset"][0])
	helpers.Check(err, "Parsing Offset from query parameters")
	limit, err := strconv.Atoi(params["limit"][0])
	helpers.Check(err, "Parsing Limit from query parameters")

	questions := services.GetAllProblems(PgDB, offset, limit)
	jsonOut, err := json.Marshal(questions)
	helpers.Check(err, "Convert Questions to JSON")
	w.Write(jsonOut)
}
