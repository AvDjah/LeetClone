import {useContext, useEffect} from "react"
import {LoginContext} from "../../App.tsx"
import {useNavigate} from "react-router-dom"
import {QuestionList} from "./Components/QuestionList.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {PersonalQuestionList} from "./Components/PersonalQuestionList.tsx";


export const Navbar = () => {

    return (
        <div className="mx-2 p-4">
            <nav>
                <span
                    className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg">Home</span>
                <span
                    className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg ">Problems</span>
                <span
                    className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg ">About</span>
                <span
                    className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg ">My Profile</span>
            </nav>
        </div>
    )
}


export const Banner = () => {
    return (
        <div>
            <div className="text-5xl font-poppins text-white font-mono p-2 m-2">SheetCode</div>
            <Navbar/>
        </div>
    )
}


function Dashboard() {

    const loginContext = useContext(LoginContext)
    const {logout, user, getAccessTokenSilently, isAuthenticated} = useAuth0()

    console.log("LoginContext:", loginContext.userProfile)

    const getPersonalData = async () => {
        try {
            const accessToken = await getAccessTokenSilently();

            const response = await fetch('http://localhost:8080/private'
                , {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

            const responseData = await response.json();
            console.log(responseData)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: "https://quickstarts/api",
                        scope: "read:messages openid email profile"
                    }
                })


            } catch (e) {
                console.log(e)
            }
        }
    }, [getAccessTokenSilently]);

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
        <Banner/>
        {/*<QuestionList/>*/}
        <div className="text-white w-4/5 mx-auto border-2 p-4 text-xl">
            <PersonalQuestionList/>
        </div>
        <div onClick={loginPing}
             className="block text-black p-4 text-xl m-8 text-center bg-amber-500 cursor-pointer active:translate-y-1"> Ping
            Login Check
        </div>
        <div
            className="block text-black p-4 text-xl m-8 text-center bg-amber-500 cursor-pointer active:translate-y-1"
            onClick={() => {
                getPersonalData().catch(e => console.log(e))
            }}
        >
            GetPersonal
        </div>
    </div>

}


export default Dashboard