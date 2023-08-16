import {useNavigate} from "react-router-dom";
import {Question} from "./types";

export const QuestionItem = (props: { question: Question }) => {

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


    return <div
        className=" my-4 flex relative md:flex-row flex-col border-amber-50 border-2 shadow-xl md:m-4 p-4 justify-between items-center">
        <div className="flex flex-col">
            <div className="flex flex-row items-center">
                <div>{props.question.title}</div>
                <div className="flex flex-row items-center mx-8">
                    <span style={{borderColor: getDifficultyColor(), color: getDifficultyColor()}}
                          className="text-sm border-2 rounded-xl py-1 px-2 mx-2">{props.question.difficulty}</span>
                    <span
                        className="text-sm  border-2 border-white rounded-xl py-1 px-2 mx-2">{props.question.submissions}</span>
                </div>
            </div>
            <button onClick={handleOnAttempt}
                    className="transition-all ease-in active:translate-y-1 active:translate-x-1 shadow-md shadow-green-300 bg-green-700 text-white font-mono text-lg inline-block w-28 my-2 rounded-lg py-2">Attempt
            </button>
            {/*<div className="text-lg my-2 md:w-4/5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam consequatur dolorum esse eveniet iste labore laboriosam nam obcaecati perspiciatis, possimus reiciendis reprehenderit veniam voluptatibus! Debitis facilis magni optio quis soluta?</div>*/}
        </div>
        <div className="rounded-full h-2 w-2 bg-amber-500 mx-4 p-2 md:static absolute right-0 "></div>
    </div>
}