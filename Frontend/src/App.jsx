import { BrowserRouter as Router, Routes, Route, } from "react-router"
import { Navigate } from "react-router"


import HomePage from "./pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"

import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"
import ProfilePage from "./Pages/ProfilePage"

import { useAuthStore } from "./lib/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from 'react-hot-toast';
import Layout from "./Components/Layout"

function App() {

  const { authUser, checkAuth, isAuthChecking } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({ authUser });

  if (isAuthChecking && !authUser) return (

    <div className="flex items-center justify-center h-screen">
      <Loader className='size-10 animate-spin' />
    </div>

  )


  return (
    <>

      <Toaster />
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>

            <Route path="/home" element={authUser ? <HomePage /> : <Navigate to='/login' />} />
            <Route path="/" element={!authUser ? <SignUpPage /> : <Navigate to="/home" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
            <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to='/login' />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />

          </Route>
        </Routes>
      </Router>

    </>
  )
}

export default App
