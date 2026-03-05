import {Button} from "../ui/Button"
import type {Booking} from "../../../../shared/booking"

interface Props {
    booking: Booking
    onCancel: (id: number) => void
    eventDateTime?: string
}

export const BookingItem = ({booking, onCancel, eventDateTime}: Props) => {
    const isCancelled = booking.cancelled_at !== null
    const isUsed = booking.is_used

    const statusLabel = isCancelled ? "Отменено" : isUsed ? "Использовано" : "Активно"
    const statusColor = isCancelled
        ? "text-red-500"
        : isUsed
            ? "text-gray-500"
            : "text-emerald-600"

    return (
        <div className="border border-gray-200 p-3 rounded-xl flex items-center justify-between bg-white/70">
            <div>
                <p className="font-medium">
                    {eventDateTime ? `Билет на ${eventDateTime}` : `Билет #${booking.id}`}
                </p>
                <p className={`text-sm ${statusColor}`}>
                    Статус: {statusLabel}
                </p>
                <p className="text-xs text-gray-400">
                    Дата: {new Date(booking.created_at).toLocaleDateString()}
                </p>
            </div>
            {!isCancelled && !isUsed && (
                <Button variant="danger" onClick={() => onCancel(booking.id)}>
                    Отменить
                </Button>
            )}
        </div>
    )
}

