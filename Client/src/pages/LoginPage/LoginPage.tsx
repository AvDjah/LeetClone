import { useContext, useEffect, useState } from "react"
import { LoginContext } from "../../App"
import { useNavigate } from "react-router-dom"



export const LoginBox = () => {

    const loginContext = useContext(LoginContext)


    const handleLogin = () => {
        if (loginContext.setLoginStatus !== null) {
            loginContext.setLoginStatus(true)
            console.log("Status Changed")
        }
    }

    return (
        <div className="mx-auto shadow-xl w-96 p-20 h-1/1 rounded-xl shadow-blue-500 bg-white m-5">
            <div className="justify-evenly text-start inline-block" >
                <form>
                    <label className="mx-2 block"  >Email</label>
                    <input key={1} id="email" className="border-2 block p-2 m-2" />
                    <label className="mx-2 block" htmlFor="password" >Password</label>
                    <input key={2} id="password" className="border-2 block p-2 m-2" />
                </form>
            </div>
            <div className="flex-col justify-center inline-block"  ><button className="bg-blue-500 text-2xl shadow-lg shadow-blue-600 text-white px-5 py-2
                transition-all ease-in-out active:translate-y-1" onClick={handleLogin} >Login</button></div>
        </div>
    )
}


const Banner = () => {
    return (
        <div className=" shadow-blue-500 shadow-xl rounded-xl text-4xl font-mono border-2 inline-block bg-white p-10 m-5" >{"<> Login To Code </>"}</div>
    )
}


export const LoginPage = () => {

    const loginContext = useContext(LoginContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (loginContext.isLoggedIn === true) {
            console.log("Already Logged In")
            navigate("/")
        } else {
            console.log("Success -> to Login Screen")
        }
    })

    return <div className="text-center">
        <Banner />
        <LoginBox />
    </div >

}