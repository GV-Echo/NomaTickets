import {createContext, useEffect, useState, useRef, type ReactNode} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import * as authService from "../services/authService"
import {authApi} from "../services/authService"
import type {UserProfile, LoginRequest, RegisterRequest, AuthContextValue} from "../types/auth.types"


export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // Флаг чтобы не запускать несколько refresh одновременно
    const isRefreshing = useRef(false)
    const refreshSubscribers = useRef<Array<(success: boolean) => void>>([])

    // Восстановление сессии при загрузке
    useEffect(() => {
        authService.getMe()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    // Интерцептор: при 401 пробуем refresh, затем повторяем запрос
    useEffect(() => {
        const interceptor = authApi.interceptors.response.use(
            (response) => response,
            async (err) => {
                const originalRequest = err.config

                // Если 401 и это не сам запрос на refresh/login/logout
                if (
                    err.response?.status === 401 &&
                    !originalRequest._retry &&
                    !originalRequest.url?.includes('/refresh') &&
                    !originalRequest.url?.includes('/login') &&
                    !originalRequest.url?.includes('/logout')
                ) {
                    if (isRefreshing.current) {
                        // Ждём пока другой поток завершит refresh
                        return new Promise((resolve, reject) => {
                            refreshSubscribers.current.push((success) => {
                                if (success) resolve(authApi(originalRequest))
                                else reject(err)
                            })
                        })
                    }

                    originalRequest._retry = true
                    isRefreshing.current = true

                    try {
                        await authService.refresh()
                        refreshSubscribers.current.forEach((cb) => cb(true))
                        return authApi(originalRequest)
                    } catch {
                        refreshSubscribers.current.forEach((cb) => cb(false))
                        setUser(null)
                        navigate("/login")
                        return Promise.reject(err)
                    } finally {
                        isRefreshing.current = false
                        refreshSubscribers.current = []
                    }
                }

                return Promise.reject(err)
            }
        )

        return () => authApi.interceptors.response.eject(interceptor)
    }, [navigate])

    const login = async (data: LoginRequest) => {
        setLoading(true)
        setError(null)
        try {
            await authService.login(data)
            const profile = await authService.getMe()
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
            await authService.register(data)
            const profile = await authService.getMe()
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

    const logout = async () => {
        try {
            await authService.logout()
        } finally {
            setUser(null)
            navigate("/login")
        }
    }

    const clearError = () => setError(null)

    return (
        <AuthContext.Provider value={{user, loading, error, login, register, logout, clearError}}>
            {children}
        </AuthContext.Provider>
    )
}
