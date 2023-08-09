import { useContext, useEffect } from "react"
import { LoginContext } from "../../App.tsx"
import { useNavigate } from "react-router-dom"
import {QuestionList} from "./Components/QuestionList.tsx";





export const Navbar = ()=>{

    return (
        <div className="mx-2 p-4" >
            <nav>
                <span className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg">Home</span>
                <span className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg " >Problems</span>
                <span className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg " >About</span>
                <span className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg "  >My Profile</span>
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

    const navigate = useNavigate()
    const loginContext = useContext(LoginContext)


    useEffect(() => {
        if (!loginContext.isLoggedIn) {
            navigate("/login")
        }
    })

    const handleLogOut = () => {

        fetch("http://localhost:8080/logout").then(
            res => {
                return res.json()
            }
        ).then(res => {
            console.log(res)
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            console.log("Logged Out")
        })

        if (loginContext.setLoginStatus !== null)
            loginContext.setLoginStatus(false)
        if(loginContext.setUserProfile !== null)
            loginContext.setUserProfile(null)
    }

    const loginPing = () => {
        fetch("http://localhost:8080/checkLogin",{
            credentials : "include",
        }).then(res => res.text()).then(
            res => {
                console.log(res)
            }
        ).catch(e => {console.log(e)})
    }

    return <div className="relative">
        <div className="fixed right-8 top-8 p-2 bg-white active:translate-y-1 transition-all ease-in-out cursor-pointer" onClick={handleLogOut} >Log Out</div>
        <Banner/>
        <QuestionList/>
        <div onClick={loginPing} className="block text-black p-4 text-xl m-8 text-center bg-amber-500 cursor-pointer active:translate-y-1" > Ping Login Check </div>
    </div>

}


export default Dashboard