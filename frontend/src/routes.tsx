import {Routes, Route, Navigate} from "react-router-dom"
import {AuthPage} from "./pages/Auth/Auth"
import {HomePage} from "./pages/Home/HomePage.tsx"
import {useAuth} from "./hooks/useAuth.tsx"
import {observer} from 'mobx-react-lite'

const ProtectedRoute = observer(({children}: { children: React.ReactNode }) => {
    const {user, loading} = useAuth()
    if (loading) return null
    return user ? <>{children}</> : <Navigate to="/login" replace/>
})

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage/>}/>

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/login" replace/>}
            />
        </Routes>
    )
}