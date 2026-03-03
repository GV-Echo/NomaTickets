import {Input} from "../ui/Input.tsx"
import {Button} from "../ui/Button.tsx"
import type {LoginFormState} from "../../types/auth.types.ts"
import type {FormEvent} from "react";

interface Props {
    form: LoginFormState
    loading: boolean
    onChange: (field: keyof LoginFormState, value: string) => void
    onSubmit: (e: FormEvent) => void
    onSwitchToRegister: () => void
}

export const LoginForm = ({form, loading, onChange, onSubmit, onSwitchToRegister}: Props) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                    type="email"
                    placeholder="ivan@example.com"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Входим..." : "Войти"}
            </Button>

            <p className="text-center text-sm text-gray-500">
                Нет аккаунта?{" "}
                <button
                    type="button"
                    className="text-indigo-600 hover:underline font-medium"
                    onClick={onSwitchToRegister}
                >
                    Зарегистрироваться
                </button>
            </p>
        </form>
    )
}

