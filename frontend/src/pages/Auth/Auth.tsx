import {useState} from "react"
import {Input} from "../../components/ui/Input"
import {Button} from "../../components/ui/Button"
import logoUrl from "../../assets/logo.png"
import type {SubmitEvent} from "react"
import type {RegisterForm, LoginForm} from "../../types/AuthFormTypes.tsx";

type Mode = "login" | "register"


export const AuthPage = () => {
    const [mode, setMode] = useState<Mode>("login")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [loginForm, setLoginForm] = useState<LoginForm>({
        email: "",
        password: "",
    })

    const [registerForm, setRegisterForm] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleLoginSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        // TODO: Добавить обработку авторизации
    }

    const handleRegisterSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)
        if (registerForm.password !== registerForm.confirmPassword) {
            setError("Пароли не совпадают")
            return
        }
        if (registerForm.password.length < 6) {
            setError("Пароль должен содержать минимум 6 символов")
            return
        }

        setLoading(true)
        // TODO: Добавить обработку регистрации
    }

    const switchMode = (newMode: Mode) => {
        setMode(newMode)
        setError(null)
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={logoUrl}
                        alt="Noma"
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-indigo-600 mb-3"
                    />
                    <h1 className="text-2xl font-bold text-indigo-600">NomaTickets</h1>
                    <p className="text-gray-500 text-sm mt-1">Ваш сервис бронирования билетов</p>
                </div>

                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
                    <button
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${
                            mode === "login"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                        onClick={() => switchMode("login")}
                    >
                        Войти
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${
                            mode === "register"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                        onClick={() => switchMode("register")}
                    >
                        Регистрация
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3">
                        {error}
                    </div>
                )}

                {mode === "login" && (
                    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input
                                type="email"
                                placeholder="ivan@example.com"
                                required
                                autoComplete="email"
                                value={loginForm.email}
                                onChange={(e) =>
                                    setLoginForm((prev) => ({...prev, email: e.target.value}))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Пароль
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                value={loginForm.password}
                                onChange={(e) =>
                                    setLoginForm((prev) => ({...prev, password: e.target.value}))
                                }
                            />
                        </div>
                        <Button variant="hoverIndigo" disabled={loading} className="w-full mt-2">
                            {loading ? "Входим..." : "Войти"}
                        </Button>
                        <p className="text-center text-sm text-gray-500">
                            Нет аккаунта?{" "}
                            <button
                                type="button"
                                className="text-indigo-600 hover:underline font-medium"
                                onClick={() => switchMode("register")}
                            >
                                Зарегистрироваться
                            </button>
                        </p>
                    </form>
                )}

                {mode === "register" && (
                    <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Имя
                            </label>
                            <Input
                                type="text"
                                placeholder="Иван Петров"
                                required
                                autoComplete="name"
                                minLength={2}
                                value={registerForm.name}
                                onChange={(e) =>
                                    setRegisterForm((prev) => ({...prev, name: e.target.value}))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input
                                type="email"
                                placeholder="ivan@example.com"
                                required
                                autoComplete="email"
                                value={registerForm.email}
                                onChange={(e) =>
                                    setRegisterForm((prev) => ({...prev, email: e.target.value}))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Пароль
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                minLength={6}
                                value={registerForm.password}
                                onChange={(e) =>
                                    setRegisterForm((prev) => ({
                                        ...prev,
                                        password: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Повторите пароль
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                minLength={6}
                                value={registerForm.confirmPassword}
                                onChange={(e) =>
                                    setRegisterForm((prev) => ({
                                        ...prev,
                                        confirmPassword: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <Button variant="hoverIndigo" disabled={loading} className="w-full mt-2">
                            {loading ? "Регистрируемся..." : "Создать аккаунт"}
                        </Button>
                        <p className="text-center text-sm text-gray-500">
                            Уже есть аккаунт?{" "}
                            <button
                                className="text-indigo-600 hover:underline font-medium"
                                onClick={() => switchMode("login")}
                            >
                                Войти
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}


