export const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-auto">
        <div
            className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <span className="text-sm text-gray-400">
        © {new Date().getFullYear()} NomaTickets — сервис бронирования билетов
      </span>
        </div>
    </footer>
)
