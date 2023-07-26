import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import { Editor } from "@monaco-editor/react";

export const ProblemDescription = (props: { data: string }) => {

    return <div className="h-5/6 ">
        <div className="font-bold text-2xl">Problem Description</div>
        <textarea value={props.data} className="w-full h-full bg-gray-100 border-none outline-none shadow-none "
                  readOnly></textarea>
    </div>
}

type CodeOutput = {
    verdict: boolean
    output: string
}


export const Spinner = () => {
    return (
        <>
            <svg aria-hidden="true"
                 className="w-6 h-6 text-white animate-spin  fill-blue-600"
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"/>
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"/>
            </svg>
        </>
    )
}


export const ProblemEditor = (props: { data: string}) => {

    const [code, setCode] = useState("")
    const [output, setOutput] = useState("")
    const [running, setRunning] = useState(false)
    const submitCode = () => {
        if(code.trim() === ""){
            alert("No Code")
            return
        }
        setRunning(true)
        fetch("http://localhost:8080/runCode", {
            method: "POST",
            body: code,
        }).then(async res => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data: CodeOutput = await res.json()
            setRunning(false)
            setOutput(data.output)
        }).catch(e => {
            console.log(e)
            setRunning(false)
        })
    }

    return <div className="h-full">
        <Editor height={550}  onChange={val => val !== undefined ? setCode(val) : null} defaultLanguage="python" language="python" theme="vs-dark" ></Editor>
        <div className="mt-4">
            <div
                onClick={submitCode}
                className="p-2 m-2 text-white bg-green-600 rounded-sm cursor-pointer transition-all ease-in-out active:translate-y-1 inline-block">Submit
            </div>
            <div
                onClick={()=>setCode("")}
                className="p-2 m-2 text-white bg-red-600 rounded-sm  inline-block   transition-all ease-in-out active:translate-y-1 cursor-pointer">Reset
            </div>
            <div className="inline-block mx-2">
                {running ? <Spinner/> : null}
            </div>
        </div>
        <textarea readOnly className="bg-gray-800 text-white font-mono p-2 w-full h-48" value={output}></textarea>
    </div>
}




type Problem = {
    id: number
    title: string
    description: string
}

export const ProblemPage = () => {

    const {problemId} = useParams()

    const [isLoading, setLoading] = useState(true)
    const [problem, setProblem] = useState({id: -1, title: "", description: ""})
    const navigate = useNavigate()
    const fetchProblem = async () => {
        const data = await fetch("http://localhost:8080/getProblem", {
            method: "POST",
            body: problemId
        })
        if (data.status === 406) {
            console.log("Invalid Problem ID")
            navigate("/error")
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Problem = await data.json();
        setLoading(false)
        setProblem(json)
        // console.log(json.description)
    }


    useEffect(() => {
        console.log(problemId)
        fetchProblem().catch(e => console.log(e))
    }, [])

    return <div>
        {isLoading ? <div>Loading</div> : <>
            <div className="text-3xl p-2 m-4 font-heading text-white">Problem ID :{problemId}</div>
            <div className="flex h-screen m-2 p-2 w-full  flex-col md:flex-row justify-evenly ">
                <div className="h-full border-2 bg-gray-100 md:w-1/2 mx-2 p-4 shadow-xl shadow-gray-700 rounded-xl "  ><ProblemDescription
                    data={!isLoading ? problem.description : "No Data"}/></div>
                <div className="h-full border-2 bg-gray-100 md:w-1/2 mx-2 p-4 shadow-xl shadow-gray-700 rounded-xl "><ProblemEditor
                    data={!isLoading ? "" : "No Data"}/></div>
            </div>
        </>}
    </div>
}