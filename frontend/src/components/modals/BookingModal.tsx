import { useState, useMemo } from "react"
import { Modal } from "../ui/Modal"
import { useTickets } from "../../hooks/useTickets"
import { useAuth } from "../../hooks/useAuth"
import { DateSelect } from "../booking/DateSelect"
import { TimeSelect } from "../booking/TimeSelect"
import { TicketSummary } from "../booking/TicketSummary"
import type { Event } from "../../../../shared/event.ts"
import type { Ticket } from "../../../../shared/ticket.ts"
import { createBooking } from "../../services/bookingService.ts"

interface Props {
    isOpen: boolean
    onClose: () => void
    event: Event
}
 
export const BookingModal = ({ isOpen, onClose, event }: Props) => {
    const { user } = useAuth()
    const { getDates, getTimesByDate, loading: ticketsLoading, error: ticketsError, refresh } = useTickets(event?.id || 0)

    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const dates = getDates(event?.id || 0)
    const times = selectedDate
        ? getTimesByDate(event.id, selectedDate)
        : []

    const selectedTicket = useMemo(
        () => times.find((t) => t.id === selectedTicketId),
        [selectedTicketId, times]
    )

    const maxAllowed = Math.min(selectedTicket?.quantity || 0, 10)
    const totalPrice = selectedTicket
        ? selectedTicket.price * quantity
        : 0

    const handleDateChange = (date: string) => {
        setSelectedDate(date)
        setSelectedTicketId(null)
        setQuantity(1)
        setError(null)
    }

    const handleTimeChange = (ticketId: number) => {
        setSelectedTicketId(ticketId)
        setQuantity(1)
        setError(null)
    }

    const handleBuy = async () => {
        if (!selectedTicket || !user) return

        try {
            setIsLoading(true)
            setError(null)

            // если quantity > 1 — делаем несколько броней
            for (let i = 0; i < quantity; i++) {
                await createBooking(selectedTicket.id, user.id)
            }

            alert("Покупка успешно выполнена")
            await refresh()
            onClose()
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Ошибка при покупке билета"
            )
        } finally {
            setIsLoading(false)
        }
    }

    if (!event) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4 min-w-75 min-h-75">
                <h2 className="text-2xl font-semibold">{event.name}</h2>
                <p className="text-gray-500">
                    Длительность: {event.duration} минут
                </p>

                {ticketsLoading && <p className="text-blue-500">Загрузка билетов...</p>}
                {ticketsError && <p className="text-red-500">{ticketsError}</p>}
                
                {!ticketsLoading && (
                    <>
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
                    </>
                )}

                {selectedTicket && (
                    <TicketSummary
                        quantity={quantity}
                        maxAllowed={maxAllowed}
                        totalPrice={totalPrice}
                        isUnavailable={selectedTicket.quantity === 0}
                        onQuantityChange={setQuantity}
                        onBuy={handleBuy}
                        isLoading={isLoading}
                    />
                )}

                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </Modal>
    )
}