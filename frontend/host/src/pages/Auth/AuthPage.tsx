import {useState, type FormEvent} from 'react'
import {observer} from 'mobx-react-lite'
import {AuthLogo} from '../../components/auth/AuthLogo'
import {AuthTabs} from '../../components/auth/AuthTabs'
import {AuthError} from '../../components/auth/AuthError'
import {LoginForm} from '../../components/auth/LoginForm'
import {RegisterForm} from '../../components/auth/RegisterForm'
import {useAuth} from '../../hooks/useAuth'
import type {LoginFormState, RegisterFormState} from '../../types/auth.types'

type Mode = 'login' | 'register'

export const AuthPage = observer(() => {
    const {login, register, loading, error, clearError} = useAuth()
    const [mode, setMode] = useState<Mode>('login')

    const [loginForm, setLoginForm] = useState<LoginFormState>({email: '', password: ''})
    const [registerForm, setRegisterForm] = useState<RegisterFormState>({
        name: '', email: '', password: '', confirmPassword: '',
    })

    const handleModeSwitch = (m: Mode) => {
        setMode(m)
        clearError()
    }

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        await login({email: loginForm.email, password: loginForm.password})
    }

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault()
        if (registerForm.password !== registerForm.confirmPassword) return
        await register({
            name: registerForm.name,
            email: registerForm.email,
            password: registerForm.password,
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
                <AuthLogo/>
                <AuthTabs mode={mode} onSwitch={handleModeSwitch}/>
                <AuthError message={error}/>

                {mode === 'login' ? (
                    <LoginForm
                        form={loginForm}
                        loading={loading}
                        onChange={(field, value) => setLoginForm((prev) => ({...prev, [field]: value}))}
                        onSubmit={handleLogin}
                        onSwitchToRegister={() => handleModeSwitch('register')}
                    />
                ) : (
                    <RegisterForm
                        form={registerForm}
                        loading={loading}
                        onChange={(field, value) => setRegisterForm((prev) => ({...prev, [field]: value}))}
                        onSubmit={handleRegister}
                        onSwitchToLogin={() => handleModeSwitch('login')}
                    />
                )}
            </div>
        </div>
    )
})
