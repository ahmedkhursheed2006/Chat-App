import { BrowserRouter as Router, Routes, Route, } from "react-router"
import { Navigate } from "react-router"


import HomePage from "./pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"

import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"
import ProfilePage from "./Pages/ProfilePage"
import SelectedUserProfile from "./Pages/SelectedUserProfile"
import { useAuthStore } from "./lib/useAuthStore"
import { useThemeStore } from "./lib/useThemeStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from 'react-hot-toast';
import Layout from "./Components/Layout"

function App() {

  const { authUser, checkAuth, isAuthChecking } = useAuthStore();
  const { theme } = useThemeStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({ authUser });

  if (isAuthChecking && !authUser) return (

    <div className="flex items-center justify-center h-full">
      <Loader className='size-10 animate-spin' />
    </div>

  )


  return (
    <>
      <div data-theme={theme}>
        <Toaster />
        <Router>
          <Routes>
            <Route path='/' element={<Layout />}>

              <Route path="/" element={authUser ? <HomePage /> : <Navigate to='/login' />} />
              <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
              <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to='/login' />} />
              <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />

              <Route path="/:id/profile" element={<SelectedUserProfile />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
