import {createContext, useEffect, useState, type ReactNode} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import * as authService from "../services/authService"
import type {UserProfile, LoginRequest, RegisterRequest, AuthContextValue} from "../types/auth.types"
import {deleteCookie, getCookie, setCookie} from "../utils/cookie.ts";

const TOKEN_KEY = "access_token"

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = getCookie(TOKEN_KEY)
        if (!token) {
            setLoading(false)
            return
        }
        authService.getMe(token)
            .then(setUser)
            .catch(() => deleteCookie(TOKEN_KEY))
            .finally(() => setLoading(false))
    }, [])

    const login = async (data: LoginRequest) => {
        setLoading(true)
        setError(null)
        try {
            const {access_token} = await authService.login(data)
            setCookie(TOKEN_KEY, access_token)
            const profile = await authService.getMe(access_token)
            setUser(profile)
            navigate("/home")
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 401) {
                setError("Неверный email или пароль")
            } else {
                setError("Ошибка при входе. Попробуйте позже")
            }
        } finally {
            setLoading(false)
        }
    }

    const register = async (data: RegisterRequest) => {
        setLoading(true)
        setError(null)
        try {
            const {access_token} = await authService.register(data)
            setCookie(TOKEN_KEY, access_token)
            const profile = await authService.getMe(access_token)
            setUser(profile)
            navigate("/home")
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 409) {
                setError("Пользователь с таким email уже существует")
            } else {
                setError("Ошибка при регистрации. Попробуйте позже")
            }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        deleteCookie(TOKEN_KEY)
        setUser(null)
        navigate("/login")
    }

    const clearError = () => setError(null)

    return (
        <AuthContext.Provider value={{user, loading, error, login, register, logout, clearError}}>
            {children}
        </AuthContext.Provider>
    )
}

