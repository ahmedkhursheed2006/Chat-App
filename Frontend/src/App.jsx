import { BrowserRouter as Router, Routes, Route, } from "react-router"
import { Navigate } from "react-router"


import HomePage from "./pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"

import LoginPage from "./Pages/LoginPage"
import ProfilePage from "./Pages/ProfilePage"
import SelectedUserProfile from "./Pages/SelectedUserProfile"
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


  if (isAuthChecking && !authUser) return (

    <div className="flex items-center justify-center h-full">
      <Loader className='size-10 animate-spin' />
    </div>

  )


  return (
    <>
        <Toaster />
        <Router>
          <Routes>
            <Route path='/' element={<Layout />}>

              <Route path="/" element={authUser ? <HomePage /> : <Navigate to='/login' />} />
              <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
              <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />

              <Route path="/:id/profile" element={<SelectedUserProfile />} />
            </Route>
          </Routes>
        </Router>
    </>
  )
}

export default App
