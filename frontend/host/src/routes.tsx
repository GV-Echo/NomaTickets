import {Routes, Route, Navigate} from 'react-router-dom'
import {observer} from 'mobx-react-lite'
import {AuthPage} from './pages/Auth/AuthPage'
import {HomePage} from './pages/Home/HomePage'
import {AdminPage} from './pages/Home/AdminPage'
import {useAuth} from './hooks/useAuth'

const ProtectedRoute = observer(({children}: { children: React.ReactNode }) => {
    const {user, loading} = useAuth()
    if (loading) return null
    return user ? <>{children}</> : <Navigate to="/login" replace/>
})

const AdminRoute = observer(({children}: { children: React.ReactNode }) => {
    const {user, loading} = useAuth()
    if (loading) return null
    if (!user) return <Navigate to="/login" replace/>
    if (!user.is_admin) return <Navigate to="/home" replace/>
    return <>{children}</>
})

export const AppRoutes = () => (
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
            path="/admin"
            element={
                <AdminRoute>
                    <AdminPage/>
                </AdminRoute>
            }
        />

        <Route path="*" element={<Navigate to="/login" replace/>}/>
    </Routes>
)
