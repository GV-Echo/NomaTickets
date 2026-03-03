import { Drawer } from "../ui/Drawer"
import { Button } from "../ui/Button"
import { useBookings } from "../../hooks/useBooking"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const BookingDrawer = ({ isOpen, onClose }: Props) => {
  const { bookings, cancel } = useBookings()

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Мои билеты</h2>

        {bookings.length === 0 && <p>Нет бронирований</p>}

        {bookings.map(b => (
          <div key={b.id} className="border p-3 rounded-xl">
            <p>{b.event.name}</p>
            <Button variant="danger" onClick={() => cancel(b.id)}>
              Отменить
            </Button>
          </div>
        ))}
      </div>
    </Drawer>
  )
}