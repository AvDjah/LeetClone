import { createContext, useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage/LoginPage'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import {ProblemPage} from "./pages/Problem/ProblemPage.tsx";


const createRouter = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />
  }, {
    path: "/login",
    element: <LoginPage />
  }, {
    path : "/problem/:problemId",
    element : <ProblemPage/>
  }
])

type LoginStatus = {
  isLoggedIn: boolean,
  setLoginStatus: React.Dispatch<React.SetStateAction<boolean>> | null
}

export const LoginContext = createContext<LoginStatus>({ isLoggedIn: false, setLoginStatus: null })



function App() {

  const [isLoggedIn, setLoginStatus] = useState(false)


  return (
    <LoginContext.Provider value={{ isLoggedIn: isLoggedIn, setLoginStatus }} >
      <RouterProvider router={createRouter} ></RouterProvider>
    </LoginContext.Provider>
  )
}

export default App
