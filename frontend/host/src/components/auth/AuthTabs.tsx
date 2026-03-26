type Mode = 'login' | 'register'

interface Props {
    mode: Mode
    onSwitch: (mode: Mode) => void
}

export const AuthTabs = ({mode, onSwitch}: Props) => (
    <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
        {(['login', 'register'] as Mode[]).map((m) => (
            <button
                key={m}
                type="button"
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    mode === m
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
                onClick={() => onSwitch(m)}
            >
                {m === 'login' ? 'Войти' : 'Регистрация'}
            </button>
        ))}
    </div>
)
