import {Drawer} from "../ui/Drawer"
import {useBookings} from "../../hooks/useBooking"
import {BookingItem} from "../booking/BookingItem"

interface Props {
    isOpen: boolean
    onClose: () => void
}

export const BookingDrawer = ({isOpen, onClose}: Props) => {
    const {bookings, cancel} = useBookings()

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Мои билеты</h2>

                {bookings.length === 0 && <p>Нет бронирований</p>}

                {bookings.map((b) => (
                    <BookingItem key={b.id} booking={b} onCancel={cancel}/>
                ))}
            </div>
        </Drawer>
    )
}