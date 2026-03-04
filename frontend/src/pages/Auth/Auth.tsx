import {type FormEvent, useState} from "react"
import {AuthLogo} from "../../components/auth/AuthLogo.tsx"
import {AuthTabs} from "../../components/auth/AuthTabs.tsx"
import {AuthError} from "../../components/auth/AuthError.tsx"
import {LoginForm} from "../../components/auth/LoginForm.tsx"
import {RegisterForm} from "../../components/auth/RegisterForm.tsx"
import type {LoginFormState, RegisterFormState} from "../../types/auth.types"
import {useAuth} from "../../hooks/useAuth.tsx"

type Mode = "login" | "register"


export const AuthPage = () => {
    const [mode, setMode] = useState<Mode>("login")
    const {login, register, loading, error: authError, clearError} = useAuth()
    const [localError, setLocalError] = useState<string | null>(null)

    const error = localError ?? authError

    const [loginForm, setLoginForm] = useState<LoginFormState>({
        email: "",
        password: "",
    })

    const [registerForm, setRegisterForm] = useState<RegisterFormState>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        await login({email: loginForm.email, password: loginForm.password})
    }

    const handleRegisterSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        if (registerForm.password !== registerForm.confirmPassword) {
            setLocalError("Пароли не совпадают")
            return
        }
        if (registerForm.password.length < 6) {
            setLocalError("Пароль должен содержать минимум 6 символов")
            return
        }
        await register({name: registerForm.name, email: registerForm.email, password: registerForm.password})
    }

    const switchMode = (newMode: Mode) => {
        setMode(newMode)
        setLocalError(null)
        clearError()
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <AuthLogo/>
                <AuthTabs mode={mode} onSwitch={switchMode}/>
                <AuthError message={error}/>

                {mode === "login" && (
                    <LoginForm
                        form={loginForm}
                        loading={loading}
                        onChange={(field, value) =>
                            setLoginForm((prev) => ({...prev, [field]: value}))
                        }
                        onSubmit={handleLoginSubmit}
                        onSwitchToRegister={() => switchMode("register")}
                    />
                )}

                {mode === "register" && (
                    <RegisterForm
                        form={registerForm}
                        loading={loading}
                        onChange={(field, value) =>
                            setRegisterForm((prev) => ({...prev, [field]: value}))
                        }
                        onSubmit={handleRegisterSubmit}
                        onSwitchToLogin={() => switchMode("login")}
                    />
                )}
            </div>
        </div>
    )
}
