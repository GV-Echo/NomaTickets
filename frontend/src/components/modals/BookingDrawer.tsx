import {useEffect, useMemo, useState} from "react"
import {Drawer} from "../ui/Drawer"
import {useBookings} from "../../hooks/useBooking"
import {BookingItem} from "../booking/BookingItem"
import {getAllEvents, getTicketsByEvent} from "../../services/bookingService"
import type {Event} from "../../../../shared/event"
import type {Ticket} from "../../../../shared/ticket"

interface Props {
    isOpen: boolean
    onClose: () => void
}

type GroupedBookings = Record<string, number[]>

export const BookingDrawer = ({isOpen, onClose}: Props) => {
    const {bookings, loading, error, cancel, refresh} = useBookings()
    const [events, setEvents] = useState<Event[]>([])
    const [ticketsByEvent, setTicketsByEvent] = useState<Record<number, Ticket[]>>({})
    const [metaLoading, setMetaLoading] = useState(false)
    const [metaError, setMetaError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            refresh()
        }
    }, [isOpen, refresh])

    useEffect(() => {
        if (!isOpen || bookings.length === 0) return

        const loadMeta = async () => {
            try {
                setMetaLoading(true)
                setMetaError(null)

                const loadedEvents = await getAllEvents()
                setEvents(loadedEvents)

                const ticketsPromises = loadedEvents.map(e => getTicketsByEvent(e.id))
                const allTickets = await Promise.all(ticketsPromises)

                const byEvent: Record<number, Ticket[]> = {}
                loadedEvents.forEach((e, index) => {
                    byEvent[e.id] = allTickets[index]
                })
                setTicketsByEvent(byEvent)
            } catch (e) {
                setMetaError("Не удалось загрузить данные мероприятий")
            } finally {
                setMetaLoading(false)
            }
        }

        loadMeta()
    }, [isOpen, bookings])

    const ticketIdToEventName = useMemo(() => {
        const map = new Map<number, string>()
        events.forEach(event => {
            const tickets = ticketsByEvent[event.id] || []
            tickets.forEach(ticket => {
                map.set(ticket.id, event.name)
            })
        })
        return map
    }, [events, ticketsByEvent])

    const grouped: GroupedBookings = useMemo(() => {
        const groups: GroupedBookings = {}
        bookings.forEach(b => {
            const eventName = ticketIdToEventName.get(b.ticket_id) ?? "Неизвестное мероприятие"
            if (!groups[eventName]) {
                groups[eventName] = []
            }
            groups[eventName].push(b.id)
        })
        return groups
    }, [bookings, ticketIdToEventName])

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Мои билеты</h2>

                {loading && <p className="text-blue-500">Загрузка билетов...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {metaLoading && <p className="text-blue-500 text-sm">Обновление информации о мероприятиях...</p>}
                {metaError && <p className="text-red-500 text-sm">{metaError}</p>}
                {!loading && bookings.length === 0 && <p>Нет бронирований</p>}

                <div className="max-h-96 overflow-y-auto space-y-3">
                    {Object.entries(grouped).map(([eventName, bookingIds]) => (
                        <details
                            key={eventName}
                            className="border rounded-xl bg-white/60"
                            open
                        >
                            <summary className="flex items-center justify-between p-3 cursor-pointer select-none">
                                <span className="font-semibold">{eventName}</span>
                                <span className="text-xs text-gray-500">
                                    {bookingIds.length} билетов
                                </span>
                            </summary>
                            <div className="border-t px-3 py-2 space-y-2">
                                {bookingIds.map(id => {
                                    const booking = bookings.find(b => b.id === id)!
                                    return (
                                        <BookingItem
                                            key={booking.id}
                                            booking={booking}
                                            onCancel={cancel}
                                        />
                                    )
                                })}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </Drawer>
    )
}