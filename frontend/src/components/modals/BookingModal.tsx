import {useState, useMemo} from "react"
import {Modal} from "../ui/Modal"
import {useTickets} from "../../hooks/useTickets"
import {DateSelect} from "../booking/DateSelect"
import {TimeSelect} from "../booking/TimeSelect"
import {TicketSummary} from "../booking/TicketSummary"

interface Props {
    isOpen: boolean
    onClose: () => void
    event: any
}

export const BookingModal = ({isOpen, onClose, event}: Props) => {
    //const { user } = useAuth()
    const {getDates, getTimesByDate} = useTickets()

    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
    const [quantity, setQuantity] = useState(1)

    const dates = getDates(event?.id || 0)
    const times = selectedDate ? getTimesByDate(event.id, selectedDate) : []

    const selectedTicket = useMemo(
        () => times.find((t) => t.id === selectedTicketId),
        [selectedTicketId, times]
    )

    const maxAllowed = Math.min(selectedTicket?.quantity || 0, 10)
    const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0

    const handleDateChange = (date: string) => {
        setSelectedDate(date)
        setSelectedTicketId(null)
        setQuantity(1)
    }

    const handleTimeChange = (ticketId: number) => {
        setSelectedTicketId(ticketId)
        setQuantity(1)
    }

    const handleBuy = () => {
        if (!selectedTicket) return
        alert("Покупка успешно выполнена (mock)")
        onClose()
    }

    if (!event) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4 min-w-75 min-h-75">
                <h2 className="text-2xl font-semibold">{event.name}</h2>
                <p className="text-gray-500">Длительность: {event.duration} минут</p>

                <DateSelect
                    dates={dates}
                    selectedDate={selectedDate}
                    onChange={handleDateChange}
                />

                {selectedDate && (
                    <TimeSelect
                        times={times}
                        selectedTicketId={selectedTicketId}
                        onChange={handleTimeChange}
                    />
                )}

                {/* ПОКУПКА */}
                {selectedTicket && (
                    <TicketSummary
                        quantity={quantity}
                        maxAllowed={maxAllowed}
                        totalPrice={totalPrice}
                        isUnavailable={selectedTicket.quantity === 0}
                        onQuantityChange={setQuantity}
                        onBuy={handleBuy}
                    />
                )}
            </div>
        </Modal>
    )
}