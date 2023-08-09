import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

type Question = {
    id: bigint
    title: string
    description: string
    difficulty: string
    solution_link: string
    acceptance_rate: number
    url: string
    submissions: number
}


const QuestionItem = (props: { question: Question }) => {

    const navigate = useNavigate()

    const getDifficultyColor = () => {
        if (props.question.difficulty === "Easy") {
            return "green"
        }
        if (props.question.difficulty === "Medium") {
            return "yellow"
        }
        if (props.question.difficulty === "Hard") {
            return "red"
        }
    }

    const handleOnAttempt = () => {
        navigate("/problem/" + props.question.id)
    }


    return <div className=" my-4 flex relative md:flex-row flex-col border-amber-50 border-2 shadow-xl md:m-4 p-4 justify-between items-center">
        <div className="flex flex-col">
            <div className="flex flex-row items-center">
                <div>{props.question.title}</div>
                <div className="flex flex-row items-center mx-8">
                    <span style={{ borderColor : getDifficultyColor(), color : getDifficultyColor() }}
                        className="text-sm border-2 rounded-xl py-1 px-2 mx-2">{props.question.difficulty}</span>
                    <span
                        className="text-sm  border-2 border-white rounded-xl py-1 px-2 mx-2">{props.question.submissions}</span>
                </div>
            </div>
            <button onClick={handleOnAttempt}  className="transition-all ease-in active:translate-y-1 active:translate-x-1 shadow-md shadow-green-300 bg-green-700 text-white font-mono text-lg inline-block w-28 my-2 rounded-lg py-2" >Attempt</button>
            {/*<div className="text-lg my-2 md:w-4/5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consequatur dolorum esse eveniet iste labore laboriosam nam obcaecati perspiciatis, possimus reiciendis reprehenderit veniam voluptatibus! Debitis facilis magni optio quis soluta?</div>*/}
        </div>
        <div className="rounded-full h-2 w-2 bg-amber-500 mx-4 p-2 md:static absolute right-0 "></div>
    </div>
}


export const QuestionList = () => {

    const [questionList, setQuestionList] = useState<Question[]>([])
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(50)
    const stepCount = 50

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