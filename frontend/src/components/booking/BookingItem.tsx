import {Button} from "../ui/Button"
import type {Booking} from "../../../../shared/booking"

interface Props {
    booking: Booking
    onCancel: (id: number) => void
}

export const BookingItem = ({booking, onCancel}: Props) => {
    const isCancelled = booking.cancelled_at !== null
    const isUsed = booking.is_used

    return (
        <div className="border p-3 rounded-xl flex items-center justify-between">
            <div>
                <p className="font-medium">Билет #{booking.id}</p>
                <p className="text-sm text-gray-500">
                    Статус: {isCancelled ? "Отменено" : isUsed ? "Использовано" : "Активно"}
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

