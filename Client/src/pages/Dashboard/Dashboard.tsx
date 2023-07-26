import { useContext, useEffect } from "react"
import { LoginContext } from "../../App.tsx"
import { useNavigate } from "react-router-dom"





export const Navbar = ()=>{

    return (
        <div className="" >
            <nav>
                <span className="bg-white border-2 rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg">Home</span>
                <span className="bg-white border-2 rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg " >Problems</span>
                <span className="bg-white border-2 rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg " >About</span>
                <span className="bg-white border-2 rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg "  >My Profile</span>
            </nav>
        </div>
    )
}


export const Banner = () => {
    return (
        <div>
            <div className="text-5xl font-poppins text-white font-mono p-8 m-4">SheetCode</div>
            <Navbar/>
        </div>
    )
}




function Dashboard() {

    const navigate = useNavigate()
    const loginContext = useContext(LoginContext)


    useEffect(() => {
        if (loginContext.isLoggedIn === false) {
            navigate("/login")
        } else {
            console.log("Logged In")
        }
    })

    const handleLogOut = () => {
        if (loginContext.setLoginStatus !== null)
            loginContext.setLoginStatus(false)
    }

    return <div>
        <div className="fixed right-8 top-8 p-2 bg-white active:translate-y-1 transition-all ease-in-out cursor-pointer" onClick={handleLogOut} >Log Out</div>
        <Banner/>
    </div>

}


export default Dashboard