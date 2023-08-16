import {useEffect, useState} from "react";
import {QuestionItem} from "./QuestionItem.tsx";
import {Question} from "./types";



export const QuestionList = () => {

    const [questionList, setQuestionList] = useState<Question[]>([])
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(20)
    const stepCount = 20

    const loadMore = () => {
        setOffset(offset + limit + 1)
        setLimit(limit + stepCount)
        // fetchQuestions()
    }


    const fetchQuestions = () => {
        const params = new URLSearchParams({
            offset : offset.toString(),
            limit: limit.toString()
        })
        fetch("http://localhost:8080/getAllProblems?" + params.toString()).then(res => res.json()).then((res : Question[]) => {
            console.log(res)
            setQuestionList([...questionList,...res])
        }).catch(e => console.log(e))
    }

    useEffect(() => {
        fetchQuestions()
    }, [offset,limit]);

    return (
        <div className="text-2xl text-white md:w-2/3 md:mx-auto ">
            <div>
                {questionList.map((item, index) => {
                    return <div key={index}><QuestionItem question={item}/></div>
                })}
            </div>
            <button onClick={loadMore} className=" transition-all ease-in active:translate-y-1 text-white text-md inline-block p-4 text-lg m-2" >load more...</button>
        </div>
    )
}



// DUMMY QUESTIONS LIST
// const question: Question = {
//     id: 1,
//     description: "Dummy Description",
//     acceptance_rate: 92.3,
//     difficulty: "Hard",
//     solution_link: "http://localhost:8080/DummyLink",
//     url: "Dummy URL",
//     submission: 100,
//     title: "Dummy Title"
// }


// const questions: Question[] = [question, question, question, question]
// GENERATE RANDOM DIFFICULTY
// const difficulties = ["Easy","Medium","Hard"]
//
// function getRandomInt(min : number, max : number) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
// }
// const index = getRandomInt(0,2)
// props.question.difficulty = difficulties[index]