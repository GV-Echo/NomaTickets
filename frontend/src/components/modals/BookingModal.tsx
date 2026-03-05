import {useMemo, useState} from "react"
import {Modal} from "../ui/Modal"
import {useTickets} from "../../hooks/useTickets"
import {useAuth} from "../../hooks/useAuth"
import {DateSelect} from "../booking/DateSelect"
import {TimeSelect} from "../booking/TimeSelect"
import {TicketSummary} from "../booking/TicketSummary"
import type {Event} from "../../../../shared/event.ts"
import {createBooking} from "../../services/bookingService.ts"
import {useBookings} from "../../hooks/useBooking.tsx"

interface Props {
    isOpen: boolean
    onClose: () => void
    event: Event
}

export const BookingModal = ({isOpen, onClose, event}: Props) => {
    const {user} = useAuth()
    const {
        tickets,
        getDates,
        getTimesByDate,
        loading: ticketsLoading,
        error: ticketsError,
        refresh,
    } = useTickets(event?.id || 0)
    const {bookings, refresh: refreshBookings} = useBookings()

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

    const existingCountForEvent = useMemo(() => {
        if (!tickets.length || !bookings.length) return 0
        const eventTicketIds = new Set(
            tickets
                .filter(t => t.event_id === event.id)
                .map(t => t.id)
        )
        return bookings.filter(
            b => !b.cancelled_at && eventTicketIds.has(b.ticket_id)
        ).length
    }, [tickets, bookings, event.id])

    const remainingAllowedForEvent = Math.max(0, 10 - existingCountForEvent)

    const maxAllowed = selectedTicket
        ? Math.min(selectedTicket.quantity, remainingAllowedForEvent)
        : 0

    const totalPrice = selectedTicket
        ? selectedTicket.price * quantity
        : 0

    const limitReached = remainingAllowedForEvent <= 0

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
        if (!selectedTicket || !user || limitReached) return

        try {
            setIsLoading(true)
            setError(null)

            for (let i = 0; i < quantity; i++) {
                await createBooking(selectedTicket.id, user.id)
            }

            alert("Покупка успешно выполнена")
            await Promise.all([refresh(), refreshBookings()])
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
                        isUnavailable={selectedTicket.quantity === 0 || limitReached}
                        onQuantityChange={setQuantity}
                        onBuy={handleBuy}
                        isLoading={isLoading}
                    />
                )}

                {limitReached && (
                    <div className="text-amber-600 text-sm">
                        У вас уже есть 10 билетов на это мероприятие. Новые покупки недоступны.
                    </div>
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
