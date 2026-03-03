import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthPage } from "./pages/Auth/Auth"
import { HomePage } from "./pages/Home/HomePage.tsx"
// import { useAuth } from "../hooks/useAuth"

export const AppRoutes = () => {
  //const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/home"
          element={<HomePage />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}