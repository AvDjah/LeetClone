import { createContext, useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage/LoginPage'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import {ProblemPage} from "./pages/Problem/ProblemPage.tsx";
import * as React from "react";


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
  }, {
    path : "/problem/all",
    element : < Dashboard />
  }
])

export type UserProfile = {
  email : string
  name : string
  id : string
}

type LoginStatus = {
  isLoggedIn: boolean,
  userProfile : UserProfile | null
  setLoginStatus: React.Dispatch<React.SetStateAction<boolean>> | null
  setUserProfile : React.Dispatch<React.SetStateAction<UserProfile | null>> | null
}

export const LoginContext = createContext<LoginStatus>({ isLoggedIn: false, setLoginStatus: null, userProfile : null,
setUserProfile : null})



function App() {

  const [isLoggedIn, setLoginStatus] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)


  return (
    <LoginContext.Provider value={{ isLoggedIn: isLoggedIn, setLoginStatus, userProfile : userProfile, setUserProfile : setUserProfile}} >
      <RouterProvider router={createRouter} ></RouterProvider>
    </LoginContext.Provider>
  )
}

export default App
