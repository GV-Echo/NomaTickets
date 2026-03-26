import {useEffect, useMemo, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Modal} from '../ui/Modal'
import {DateSelect, TimeSelect, TicketSummary} from '../booking/BookingComponents'
import {useAuth} from '../../hooks/useAuth'
import {useTickets} from '../../hooks/useTickets'
import {useBookings} from '../../hooks/useBookings'
import {ticketStore} from '../../stores/ticketStore'
import {bookingStore} from '../../stores/bookingStore'
import type {Event} from '../../types'

interface Props {
    isOpen: boolean
    onClose: () => void
    event: Event
}

export const BookingModal = observer(({isOpen, onClose, event}: Props) => {
    const {user} = useAuth()

    const {tickets, getDates, getTimesByDate, loading: ticketsLoading, error: ticketsError} =
        useTickets(event?.id ?? 0)
    const {bookings, refresh: refreshBookings} = useBookings()

    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handler = () => refreshBookings()
        window.addEventListener('bookings:changed', handler)
        return () => window.removeEventListener('bookings:changed', handler)
    }, [refreshBookings])

    const dates = getDates(event?.id ?? 0)
    const times = selectedDate ? getTimesByDate(event.id, selectedDate) : []

    const selectedTicket = useMemo(
        () => times.find((t) => t.id === selectedTicketId),
        [selectedTicketId, times]
    )

    const existingCount = useMemo(() => {
        if (!tickets.length || !bookings.length) return 0
        const eventTicketIds = new Set(
            tickets.filter((t) => t.event_id === event.id).map((t) => t.id)
        )
        return bookings.filter((b) => !b.cancelled_at && eventTicketIds.has(b.ticket_id)).length
    }, [tickets, bookings, event.id])

    const remainingAllowed = Math.max(0, 10 - existingCount)
    const maxAllowed = selectedTicket
        ? Math.min(selectedTicket.quantity, remainingAllowed)
        : 0
    const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0
    const limitReached = remainingAllowed <= 0

    const handleDateChange = (date: string) => {
        setSelectedDate(date)
        setSelectedTicketId(null)
        setQuantity(1)
        setError(null)
    }

    const handleBuy = async () => {
        if (!selectedTicket || !user || limitReached) return
        try {
            setIsLoading(true)
            setError(null)
            ticketStore.decrementLocal(selectedTicket.id, quantity)
            for (let i = 0; i < quantity; i++) {
                await bookingStore.create(selectedTicket.id, user.id)
            }
            alert('Покупка успешно выполнена!')
            await Promise.all([
                ticketStore.fetchTickets(event.id, true),
                refreshBookings(true),
            ])
            onClose()
        } catch (err: unknown) {
            const axiosMsg =
                (err as { response?: { data?: { message?: string | string[] } } })
                    ?.response?.data?.message
            const msg = Array.isArray(axiosMsg)
                ? axiosMsg.join(', ')
                : axiosMsg ?? 'Ошибка при покупке билета'
            setError(msg)
        } finally {
            setIsLoading(false)
        }
    }

    if (!event) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4 min-w-72">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{event.name}</h2>
                    <p className="text-gray-500 text-sm">Длительность: {event.duration} мин</p>
                </div>

                {ticketsLoading && <p className="text-indigo-500 text-sm">Загрузка билетов...</p>}
                {ticketsError && <p className="text-red-500 text-sm">{ticketsError}</p>}

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
                                onChange={(id) => {
                                    setSelectedTicketId(id)
                                    setQuantity(1)
                                    setError(null)
                                }}
                            />
                        )}
                    </>
                )}

                {selectedTicket && user && (
                    <TicketSummary
                        user={user}
                        quantity={quantity}
                        maxAllowed={maxAllowed}
                        totalPrice={totalPrice}
                        isUnavailable={selectedTicket.quantity === 0 || limitReached}
                        isLoading={isLoading}
                        onQuantityChange={setQuantity}
                        onBuy={handleBuy}
                    />
                )}

                {selectedTicket && !user && (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                        Загрузка данных пользователя...
                    </p>
                )}

                {limitReached && (
                    <p className="text-amber-600 text-sm bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                        У вас уже 10 билетов на это мероприятие — лимит исчерпан.
                    </p>
                )}

                {error && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                        {error}
                    </p>
                )}
            </div>
        </Modal>
    )
})
