import {useContext} from "react"
import {LoginContext} from "../../App"
import {useAuth0} from "@auth0/auth0-react";

type LoginResult = {
    verdict: boolean
    message: string
}

export const saveJWTToLocalStorage = (token: string) => {
    localStorage.setItem("jwt", token)
    console.log("Saved JWT Token To Storage")
}

export const clearJWTFromLocalStorage = () => {
    localStorage.setItem("jwt", "")
}





export const LoginBox = () => {

    const {loginWithRedirect, user, isAuthenticated, getAccessTokenSilently} = useAuth0()

    console.log("User: ", user)

    const loginContext = useContext(LoginContext)


    const handleLogin = () => {
        loginWithRedirect().then(res => {
            console.log(res)
            return user
        }).then(res => console.log("User: ", res)).catch(e => {
            console.log(e)
        })
    }


    return (
        <div>
            <div
                className="mx-auto w-96 inline-block p-20 h-1/1 rounded-xl bg-white m-5">
                <button
                    className="bg-white shadow-xl text-lg p-4 text-center hover:-translate-y-1 transition-all ease-in rounded-lg active:border-2 active:opacity-80"
                    onClick={handleLogin}>Login Using Auth0
                </button>
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


    return <div className="text-center">
        <Banner/>
        <LoginBox/>
    </div>

}