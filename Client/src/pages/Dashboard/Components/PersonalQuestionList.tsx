import {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../../App.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {PersonalQuestion, Question} from "./types";
import {QuestionItem} from "./QuestionItem.tsx";


export const PersonalQuestionList = () => {

    const loginContext = useContext(LoginContext)
    const {user, getAccessTokenSilently} = useAuth0()
    const [questions, setQuestions] = useState<Question[]>([])

    useEffect(() => {
        if (loginContext.isLoggedIn) {
            if (user === undefined)
                return

            if (user.email === undefined) {
                return
            } else {
                getAccessTokenSilently().then(res => {
                        console.log("Access:",res)
                        return fetch("http://localhost:8080/getAttempted?" + new URLSearchParams({
                            email: user.email!
                        }), {
                            headers : {
                                Authorization:"Bearer " + res
                            }
                        })
                    }
                ).then(res => res.json()).then((res: PersonalQuestion) => {
                    console.log(res)
                    const req = {
                        ids: res.attempted
                    }
                    console.log("RESULT:", JSON.stringify(req))
                    return fetch("http://localhost:8080/getSelectedID", {
                        method: "POST",
                        body: JSON.stringify(req)
                    })

                }).then(res => res.json()).then((res: Question[]) => {
                    setQuestions(res)
                }).catch(e => console.log(e))
            }

        }
    }, [loginContext.isLoggedIn, user]);


    return (
        <div>Personal Question List <div>
            {questions.map((item, index) => {
                return <div key={index}><QuestionItem question={item}/></div>
            })}

        </div></div>
    )

}