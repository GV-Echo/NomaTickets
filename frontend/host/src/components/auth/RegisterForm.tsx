import {Input} from '../ui/Input'
import {Button} from '../ui/Button'
import type {RegisterFormState} from '../../types/auth.types'
import type {FormEvent} from 'react'

interface Props {
    form: RegisterFormState
    loading: boolean
    onChange: (field: keyof RegisterFormState, value: string) => void
    onSubmit: (e: FormEvent) => void
    onSwitchToLogin: () => void
}

export const RegisterForm = ({form, loading, onChange, onSubmit, onSwitchToLogin}: Props) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <Input
                type="text" placeholder="Иван Петров" required autoComplete="name" minLength={2}
                value={form.name} onChange={(e) => onChange('name', e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
                type="email" placeholder="ivan@example.com" required autoComplete="email"
                value={form.email} onChange={(e) => onChange('email', e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <Input
                type="password" placeholder="••••••••" required autoComplete="new-password" minLength={6}
                value={form.password} onChange={(e) => onChange('password', e.target.value)}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Повторите пароль</label>
            <Input
                type="password" placeholder="••••••••" required autoComplete="new-password" minLength={6}
                value={form.confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)}
            />
        </div>
        <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Регистрируемся...' : 'Создать аккаунт'}
        </Button>
        <p className="text-center text-sm text-gray-500">
            Уже есть аккаунт?{' '}
            <button type="button" className="text-indigo-600 hover:underline font-medium" onClick={onSwitchToLogin}>
                Войти
            </button>
        </p>
    </form>
)
