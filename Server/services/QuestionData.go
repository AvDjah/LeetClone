package services

import (
	"backend/database"
	"backend/helpers"
	"database/sql"
	"fmt"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"log"
)

type Question struct {
	Id             int     `json:"id"`
	Title          string  `json:"title"`
	Description    string  `json:"description"`
	Difficulty     string  `json:"difficulty"`
	SolutionLink   string  `json:"solution_link"`
	AcceptanceRate float64 `json:"acceptance_rate"`
	Url            string  `json:"url"`
	Submissions    int     `json:"submissions"`
}

func GetAllProblems(db *sql.DB, offset int, limit int) []Question {
	rows, err := db.Query(fmt.Sprintf("select * from \"Questions\" offset %d limit %d", offset, limit))
	helpers.Check(err, "Retrieving All rows")
	questions := make([]Question, 0)

	for rows.Next() {
		question := Question{}
		err := rows.Scan(&question.Id, &question.Title, &question.Description, &question.Difficulty, &question.SolutionLink, &question.AcceptanceRate,
			&question.Url, &question.Submissions)
		helpers.Check(err, "Looping Through results")
		questions = append(questions, question)
	}

	fmt.Println("Success Retrieval")
	return questions

}

func GetProblemWithIds(idArray []string) []Question {

	db := database.GetPgConnection()
	fmt.Println(idArray)
	query := "SELECT * FROM \"Questions\" WHERE id = ANY($1)"

	placeholders := make([]interface{}, len(idArray))
	for i := range placeholders {
		placeholders[i] = idArray[i]
	}

	rows, err := db.Query(query, pq.Array(idArray))
	if err != nil {
		log.Fatal(err)
	}
	//defer rows.Close()

	//rows, err := db.Query(fmt.Sprintf("select * from \"Questions\" where id in (%d)}", idArray))
	helpers.Check(err, "Retrieving All rows")
	questions := make([]Question, 0)

	for rows.Next() {
		question := Question{}
		err := rows.Scan(&question.Id, &question.Title, &question.Description, &question.Difficulty, &question.SolutionLink, &question.AcceptanceRate,
			&question.Url, &question.Submissions)
		helpers.Check(err, "Looping Through results")
		questions = append(questions, question)
	}

	fmt.Println("Success Retrieval")
	return questions

}
