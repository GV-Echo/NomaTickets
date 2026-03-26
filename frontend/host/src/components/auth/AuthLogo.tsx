let logoUrl: string
try {
    logoUrl = require('../../assets/logo.png')
} catch {
    logoUrl = ''
}

export const AuthLogo = () => (
    <div className="flex flex-col items-center mb-6">
        {logoUrl ? (
            <img
                src={logoUrl}
                alt="NomaTickets"
                className="h-20 w-20 rounded-full object-cover ring-2 ring-indigo-600 mb-3"
            />
        ) : (
            <div
                className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-indigo-600 mb-3">
                <span className="text-2xl">🎟</span>
            </div>
        )}
        <h1 className="text-2xl font-bold text-indigo-600">NomaTickets</h1>
        <p className="text-gray-500 text-sm mt-1">Ваш сервис бронирования билетов</p>
    </div>
)
