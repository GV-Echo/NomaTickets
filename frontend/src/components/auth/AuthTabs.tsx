type Mode = "login" | "register"

interface Props {
    mode: Mode
    onSwitch: (mode: Mode) => void
}

export const AuthTabs = ({mode, onSwitch}: Props) => {
    return (
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    mode === "login"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() => onSwitch("login")}
            >
                Войти
            </button>
            <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    mode === "register"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() => onSwitch("register")}
            >
                Регистрация
            </button>
        </div>
    )
}

