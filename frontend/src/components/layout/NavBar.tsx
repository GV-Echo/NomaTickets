import {useNavigate} from "react-router-dom"
import {HiOutlineLogout} from 'react-icons/hi';
import logoUrl from "../../assets/logo.png";

export const Navbar = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img
                    src={logoUrl}
                    alt="Noma logo"
                    className="h-25 w-25 rounded-full object-cover ring-2 ring-indigo-600"
                />
                <span className="font-bold text-xl text-indigo-600">Noma - ваш сервис бронирования билетов</span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-rose-100 text-rose-500 transition-colors duration-200"
                    aria-label="Выйти"
                    title="Выйти"
                >
                    <HiOutlineLogout size={25}/>
                </button>
            </div>
        </nav>
    )
}