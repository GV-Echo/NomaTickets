import {NavLink} from 'react-router-dom'
import {HiOutlineLogout, HiOutlineTicket, HiOutlineCollection} from 'react-icons/hi'
import {observer} from 'mobx-react-lite'
import {useAuth} from '../../hooks/useAuth'

let logoUrl: string
try {
    logoUrl = require('../../assets/logo.png')
} catch {
    logoUrl = ''
}

export const Header = observer(() => {
    const {user, logout} = useAuth()

    const navLinkClass = ({isActive}: { isActive: boolean }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
                {/* Логотип */}
                <div className="flex items-center gap-2 shrink-0">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Noma"
                             className="h-8 w-8 rounded-full object-cover ring-1 ring-indigo-600"/>
                    ) : (
                        <span className="text-xl">🎟</span>
                    )}
                    <span className="font-bold text-indigo-600 hidden sm:inline">NomaTickets</span>
                </div>

                {/* Навигация между MFE */}
                <nav className="flex items-center gap-1">
                    <NavLink to="/home" end className={navLinkClass}>
                        <HiOutlineCollection size={18}/>
                        <span className="hidden sm:inline">Мероприятия</span>
                    </NavLink>

                    {user?.is_admin && (
                        <NavLink to="/admin" className={navLinkClass}>
                            <HiOutlineTicket size={18}/>
                            <span className="hidden sm:inline">Управление</span>
                        </NavLink>
                    )}
                </nav>

                {/* Пользователь + выход */}
                <div className="flex items-center gap-3">
                    {user && (
                        <span className="text-sm text-gray-500 hidden md:inline">
              {user.name}
            </span>
                    )}
                    <button
                        onClick={() => logout()}
                        className="p-2 rounded-full hover:bg-rose-50 text-rose-500 transition-colors"
                        title="Выйти"
                        aria-label="Выйти"
                    >
                        <HiOutlineLogout size={20}/>
                    </button>
                </div>
            </div>
        </header>
    )
})
