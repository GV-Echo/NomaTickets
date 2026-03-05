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

interface BookingWithMeta {
    booking: import("../../../../shared/booking").Booking
    eventName: string
    dateTimeLabel: string | null
}

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

    const itemsWithMeta: BookingWithMeta[] = useMemo(() => {
        return bookings.map(b => {
            let foundEvent: Event | undefined
            let foundTicket: Ticket | undefined

            for (const [eventId, tickets] of Object.entries(ticketsByEvent)) {
                const t = tickets.find(ti => ti.id === b.ticket_id)
                if (t) {
                    foundTicket = t
                    foundEvent = events.find(e => e.id === Number(eventId))
                    break
                }
            }

            const eventName = foundEvent?.name ?? "Неизвестное мероприятие"

            let dateTimeLabel: string | null = null
            if (foundTicket) {
                const d = new Date(foundTicket.event_date)
                const dateStr = d.toLocaleDateString()
                const timeStr = (foundTicket.event_time || "").slice(0, 5)
                dateTimeLabel = `${dateStr}, ${timeStr}`
            }

            return {
                booking: b,
                eventName,
                dateTimeLabel,
            }
        })
    }, [bookings, events, ticketsByEvent])

    const groupedByEventName = useMemo(() => {
        const groups: Record<string, BookingWithMeta[]> = {}
        itemsWithMeta.forEach(item => {
            if (!groups[item.eventName]) {
                groups[item.eventName] = []
            }
            groups[item.eventName].push(item)
        })
        return groups
    }, [itemsWithMeta])

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Мои билеты</h2>

                {loading && <p className="text-blue-500">Загрузка билетов...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {metaLoading && <p className="text-blue-500 text-sm">Обновление информации о мероприятиях...</p>}
                {metaError && <p className="text-red-500 text-sm">{metaError}</p>}
                {!loading && bookings.length === 0 && <p>Нет бронирований</p>}

                <div className="max-h-220 overflow-y-auto space-y-3">
                    {Object.entries(groupedByEventName).map(([eventName, items]) => (
                        <details
                            key={eventName}
                            className="border rounded-xl bg-white/60"
                            open
                        >
                            <summary className="flex items-center justify-between p-3 cursor-pointer select-none">
                                <span className="font-semibold">{eventName}</span>
                                <span className="text-xs text-gray-500">
                                    {items.length} билетов
                                </span>
                            </summary>
                            <div className="border-t px-3 py-2 space-y-2">
                                {items.map(({booking, dateTimeLabel}) => (
                                    <BookingItem
                                        key={booking.id}
                                        booking={booking}
                                        onCancel={cancel}
                                        eventDateTime={dateTimeLabel || undefined}
                                    />
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </Drawer>
    )
}