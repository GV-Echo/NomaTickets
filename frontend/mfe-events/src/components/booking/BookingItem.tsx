import {useState} from 'react'
import {Button} from '../ui/Button'
import type {Booking} from '../../types'

interface Props {
    booking: Booking
    onCancel: (id: number) => void
    eventDateTime?: string
}

export const BookingItem = ({booking, onCancel, eventDateTime}: Props) => {
    const [isCancelled, setIsCancelled] = useState(booking.cancelled_at !== null)

    const statusLabel = isCancelled ? 'Отменено' : booking.is_used ? 'Использовано' : 'Активно'
    const statusColor = isCancelled
        ? 'text-red-500' : booking.is_used ? 'text-gray-500' : 'text-emerald-600'

    const handleCancel = () => {
        onCancel(booking.id)
        setIsCancelled(true)
    }

    return (
        <div className="border border-gray-200 p-3 rounded-xl flex items-center justify-between bg-white/70">
            <div>
                <p className="font-medium text-sm">
                    {eventDateTime ? `Билет на ${eventDateTime}` : `Билет #${booking.id}`}
                </p>
                <p className={`text-xs ${statusColor}`}>Статус: {statusLabel}</p>
                <p className="text-xs text-gray-400">
                    Куплен: {new Date(booking.created_at).toLocaleDateString('ru-RU')}
                </p>
            </div>
            {!isCancelled && !booking.is_used && (
                <Button variant="danger" onClick={handleCancel} className="text-xs px-3 py-1.5">
                    Отменить
                </Button>
            )}
        </div>
    )
}
