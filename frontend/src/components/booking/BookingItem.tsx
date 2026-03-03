import {Button} from "../ui/Button"

interface Booking {
    id: number
    event: { name: string }
}

interface Props {
    booking: Booking
    onCancel: (id: number) => void
}

export const BookingItem = ({booking, onCancel}: Props) => {
    return (
        <div className="border p-3 rounded-xl flex items-center justify-between">
            <p className="font-medium">{booking.event.name}</p>
            <Button variant="danger" onClick={() => onCancel(booking.id)}>
                Отменить
            </Button>
        </div>
    )
}

