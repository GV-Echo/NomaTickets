import {createContext, useContext, useEffect, useState, type ReactNode} from 'react'
import axios from 'axios'

export interface UserProfile {
    id: number
    name: string
    email: string
    is_admin: boolean
    created_at: string
}

export interface AuthContextValue {
    user: UserProfile | null
    loading: boolean
    error: string | null
    login: (d: { email: string; password: string }) => Promise<void>
    register: (d: { name: string; email: string; password: string }) => Promise<void>
    logout: () => void
    clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider or StandaloneAuthProvider')
    return ctx
}

const authApi = axios.create({baseURL: '/auth', withCredentials: true})
export const StandaloneAuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        authApi.get<UserProfile>('/me')
            .then(r => setUser(r.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    const value: AuthContextValue = {
        user, loading, error,
        login: async (d) => {
            await authApi.post('/login', d)
            const {data} = await authApi.get<UserProfile>('/me')
            setUser(data)
        },
        register: async (d) => {
            await authApi.post('/register', d)
            const {data} = await authApi.get<UserProfile>('/me')
            setUser(data)
        },
        logout: async () => {
            await authApi.post('/logout').catch(() => {
            });
            setUser(null)
        },
        clearError: () => setError(null),
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
