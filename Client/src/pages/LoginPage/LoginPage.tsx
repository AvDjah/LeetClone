import {useContext, useEffect, useState} from "react"
import {LoginContext, UserProfile} from "../../App"
import {useNavigate} from "react-router-dom"

type LoginResult = {
    verdict : boolean
    message : string
}

export const saveJWTToLocalStorage = (token : string) => {
    localStorage.setItem("jwt",token)
    console.log("Saved JWT Token To Storage")
}

export const clearJWTFromLocalStorage = () => {
    localStorage.setItem("jwt","")
}

export const LoginBox =  () => {

    const loginContext = useContext(LoginContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {

        if(email.length === 0 || password.length === 0){
            alert("Fill Correctly")
            return
        }

        const credentials = {
            email : email,
            password : password
        }

        fetch("http://localhost:8080/login",{
            method : "POST",
            body : JSON.stringify(credentials),
            credentials: "include"
        }).then(res => {
            return res.json()
        }).then((res : LoginResult)  => {
            console.log("Login Result: ",res)

            const user : UserProfile = JSON.parse(res.message)

            if(res.verdict){
                if(loginContext.setLoginStatus !== null){
                    loginContext.setLoginStatus(true)
                }
                if(loginContext.setUserProfile !== null){
                    loginContext.setUserProfile(user)
                }
            }

        }).catch(e => {
            console.log("Error:  ",e)
        })

    }

    return (
        <div>
            <div
                className="mx-auto shadow-xl w-96 inline-block p-20 h-1/1 rounded-xl shadow-blue-500 bg-white m-5">
                <div className="mx-auto text-start">
                    <form>
                        <label className="mx-2 block">Email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} key={1} id="email" className="border-2 block p-2 my-2"/>
                        <label className="mx-2 block" htmlFor="password">Password</label>
                        <input value={password} onChange={e => setPassword(e.target.value)} key={2} id="password" className="border-2 block p-2 my-2"/>
                    </form>
                </div>
                <div className="inline-block">
                    <button className="bg-blue-500 text-2xl shadow-lg shadow-blue-600 text-white px-5 py-2
                transition-all ease-in-out active:translate-y-1 my-2 " onClick={handleLogin}>Login
                    </button>
                </div>
            </div>
        </div>
    )
}


const Banner = () => {
    return (
        <div
            className=" shadow-blue-500 shadow-xl rounded-xl text-4xl font-mono border-2 inline-block bg-white p-10 m-5">{"<> Login To Code </>"}</div>
    )
}


export const LoginPage = () => {

    const loginContext = useContext(LoginContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (loginContext.isLoggedIn) {
            console.log("Already Logged In")
            navigate("/")
        } else {
            console.log("Success -> to Login Screen")
        }
    })

    return <div className="text-center">
        <Banner/>
        <LoginBox/>
    </div>

}