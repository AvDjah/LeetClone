import {useContext, useEffect, useState} from "react"
import {LoginContext} from "../../App.tsx"
import {useAuth0} from "@auth0/auth0-react";
import {PersonalQuestionList} from "./Components/PersonalQuestionList.tsx";
import {Banner} from "../../components/Banner.tsx";
import {QuestionList} from "./Components/QuestionList.tsx";


function Dashboard() {

    const loginContext = useContext(LoginContext)
    const {logout, user, getAccessTokenSilently, isAuthenticated} = useAuth0()

    const [tab,setTab] = useState(0)

    const options = [ "HOME" , "MY PROBLEMS" , "ALL PROBLEMS", "ABOUT" ]
    const tabs = [ <PersonalQuestionList />, <QuestionList />, <div>3</div>, <div>4</div>]


    const getPersonalData = async () => {
        try {
            const accessToken = await getAccessTokenSilently();

            const response = await fetch('http://localhost:8080/private'
                , {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

            const responseData = await response.json() as { data : string };
            console.log(responseData)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log("User: ", user?.email)
        if (isAuthenticated) {
            if (loginContext.setUserProfile !== null) {
                loginContext.setUserProfile({
                    email: user ? (user.email ? user.email : "Dummy") : "None",
                    name: "Dummy",
                    id: user ? (user.sub ? user.sub : "none") : "none"
                })
            }
            if (loginContext.setLoginStatus !== null) {
                loginContext.setLoginStatus(true)
            }
            console.log("SET AUTHENTICATED USER")
        }

    }, [user?.email, isAuthenticated]);

    const handleLogOut = () => {


        logout().then(res => console.log("Logged out: ", res)).catch(e => {
            console.log(e)
        }).finally(() => {
            console.log("Logged Out")
        })

        if (loginContext.setLoginStatus !== null)
            loginContext.setLoginStatus(false)
        if (loginContext.setUserProfile !== null)
            loginContext.setUserProfile(null)
    }

    const loginPing = () => {
        fetch("http://localhost:8080/checkLogin", {
            credentials: "include",
        }).then(res => res.text()).then(
            res => {
                console.log(res)
            }
        ).catch(e => {
            console.log(e)
        })
    }



    return <div className="relative">
        <div className="fixed right-8 top-8 p-2 bg-white active:translate-y-1 transition-all ease-in-out cursor-pointer"
             onClick={handleLogOut}>Log Out
        </div>
        <Banner items={options} selectedTab={tab}  setTab={setTab}  />
        {/*<QuestionList/>*/}
        <div className="text-white w-4/5 mx-auto border-2 p-4 text-xl">
            { tabs.map((item,index) => {
                return <div key={index} style={ {
                    display : tab === index ? "block" : "none"
                }}>{item}</div>
            }) }
        </div>

    </div>

}


export default Dashboard



// DEBUG BUTTONS
// <div onClick={loginPing}
// className="block text-black p-4 text-xl m-8 text-center bg-amber-500 cursor-pointer active:translate-y-1"> Ping
// Login Check
// </div>
// <div
//     className="block text-black p-4 text-xl m-8 text-center bg-amber-500 cursor-pointer active:translate-y-1"
//     onClick={() => {
//         getPersonalData().catch(e => console.log(e))
//     }}
// >
//     GetPersonal
// </div>