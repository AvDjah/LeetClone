package services

import (
	"backend/helpers"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
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
