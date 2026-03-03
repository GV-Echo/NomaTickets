import { useState, useMemo } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useTickets } from "../../hooks/useTickets"

interface Props {
  isOpen: boolean
  onClose: () => void
  event: any
}

export const BookingModal = ({ isOpen, onClose, event }: Props) => {
  //const { user } = useAuth()
  const { getDates, getTimesByDate } = useTickets()

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)

  const dates = getDates(event?.id || 0)

  const times = selectedDate
    ? getTimesByDate(event.id, selectedDate)
    : []

  const selectedTicket = useMemo(() => {
    return times.find(t => t.id === selectedTicketId)
  }, [selectedTicketId, times])

  const maxAvailable = selectedTicket?.quantity || 0
  const maxAllowed = Math.min(maxAvailable, 10)

  const totalPrice = selectedTicket
    ? selectedTicket.price * quantity
    : 0

  const handleBuy = () => {
    if (!selectedTicket) return
    alert("Покупка успешно выполнена (mock)")
    onClose()
  }

  if (!event) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 min-w-[300px] min-h-[300px]">
        <h2 className="text-2xl font-semibold">{event.name}</h2>
        <p className="text-gray-500">
          Длительность: {event.duration} минут
        </p>

        {/* ДАТА */}
        <div>
          <label className="font-medium">Дата</label>
          <select
            value={selectedDate}
            onChange={e => {
              setSelectedDate(e.target.value)
              setSelectedTicketId(null)
              setQuantity(1)
            }}
            className="w-full border rounded-xl px-3 py-2 mt-1"
          >
            <option value="">Выберите дату</option>
            {dates.map(date => (
              <option key={date.toDateString()} value={date.toDateString()}>
                {date.toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* ВРЕМЯ */}
        {selectedDate && (
          <div>
            <label className="font-medium">Время</label>
            <select
              value={selectedTicketId || ""}
              onChange={e => {
                setSelectedTicketId(Number(e.target.value))
                setQuantity(1)
              }}
              className="w-full border rounded-xl px-3 py-2 mt-1"
            >
              <option value="">Выберите время</option>
              {times.map(ticket => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.event_time} (осталось {ticket.quantity})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ПОКУПКА */}
        {selectedTicket && (
          <>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              <p><strong>Email:</strong> @mail.com</p>
              <p><strong>Имя:</strong> ...</p>

              <div>
                <label>Количество билетов</label>
                <Input
                  type="number"
                  min={1}
                  max={maxAllowed}
                  value={quantity}
                  onChange={e =>
                    setQuantity(
                      Math.min(
                        Math.max(1, Number(e.target.value)),
                        maxAllowed
                      )
                    )
                  }
                />
                <p className="text-sm text-gray-500">
                  Максимум {maxAllowed}
                </p>
              </div>

              <p className="text-lg font-semibold">
                Итого: ${totalPrice}
              </p>
            </div>

            <Button
              variant="success"
              onClick={handleBuy}
              disabled={maxAvailable === 0}
            >
              Купить
            </Button>
          </>
        )}
      </div>
    </Modal>
  )
}