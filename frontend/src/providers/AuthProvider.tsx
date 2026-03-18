import {createContext, useEffect, useRef, type ReactNode} from "react"
import {observer} from 'mobx-react-lite'
import {useNavigate} from "react-router-dom"
import * as authService from "../services/authService"
import {authApi} from "../services/authService"
import type {LoginRequest, RegisterRequest, AuthContextValue} from "../types/auth.types"
import {userStore} from "../stores/userStore"


export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = observer(({children}: { children: ReactNode }) => {
    const navigate = useNavigate()

    // Флаг чтобы не запускать несколько refresh одновременно
    const isRefreshing = useRef(false)
    const refreshSubscribers = useRef<Array<(success: boolean) => void>>([])

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
                        userStore.user = null
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

    const value: AuthContextValue = {
        user: userStore.user,
        loading: userStore.loading,
        error: userStore.error,
        login: async (data: LoginRequest) => {
            await userStore.login(data)
            navigate('/home')
        },
        register: async (data: RegisterRequest) => {
            await userStore.register(data)
            navigate('/home')
        },
        logout: () => userStore.logout(),
        clearError: () => userStore.clearError(),
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
})
