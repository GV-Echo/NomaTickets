import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
//import { LoginPage } from "../pages/Auth/LoginPage"
import { HomePage } from "./pages/home/home_page"
// import { useAuth } from "../hooks/useAuth"

export const AppRoutes = () => {
  //const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} /> */}

        <Route
          path="/home"
          element={
             <HomePage/>
          }
        />

        {/* <Route
          path="*"
          element={
            <Navigate to="/login" replace />
            
          }
        /> */}
      </Routes>
    </BrowserRouter>
  )
}