import logoUrl from "../../assets/logo.png"

export const AuthLogo = () => {
    return (
        <div className="flex flex-col items-center mb-6">
            <img
                src={logoUrl}
                alt="Noma"
                className="h-20 w-20 rounded-full object-cover ring-2 ring-indigo-600 mb-3"
            />
            <h1 className="text-2xl font-bold text-indigo-600">NomaTickets</h1>
            <p className="text-gray-500 text-sm mt-1">Ваш сервис бронирования билетов</p>
        </div>
    )
}

