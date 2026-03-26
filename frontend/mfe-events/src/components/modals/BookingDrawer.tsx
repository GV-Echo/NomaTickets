import {useEffect, useMemo, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Drawer} from '../ui/Drawer'
import {BookingItem} from '../booking/BookingItem'
import {useBookings} from '../../hooks/useBookings'
import {eventStore} from '../../stores/eventStore'
import {ticketStore} from '../../stores/ticketStore'
import type {Event, Ticket, Booking} from '../../types'

interface Props {
    isOpen: boolean
    onClose: () => void
}

interface BookingWithMeta {
    booking: Booking
    eventName: string
    dateTimeLabel: string | null
}

export const BookingDrawer = observer(({isOpen, onClose}: Props) => {
    const {bookings, loading, error, cancel, refresh} = useBookings()
    const [events, setEvents] = useState<Event[]>([])
    const [ticketsByEvent, setTicketsByEvent] = useState<Record<number, Ticket[]>>({})
    const [metaLoading, setMetaLoading] = useState(false)

    useEffect(() => {
        if (isOpen) refresh(true)
    }, [isOpen]) 

    useEffect(() => {
        if (!isOpen || bookings.length === 0) return
        const load = async () => {
            setMetaLoading(true)
            try {
                const loadedEvents = await eventStore.fetchEvents()
                setEvents(loadedEvents)
                const allTickets = await Promise.all(loadedEvents.map(e => ticketStore.fetchTickets(e.id)))
                const byEvent: Record<number, Ticket[]> = {}
                loadedEvents.forEach((e, i) => {
                    byEvent[e.id] = allTickets[i]
                })
                setTicketsByEvent(byEvent)
            } finally {
                setMetaLoading(false)
            }
        }
        load()
    }, [isOpen, bookings.length])

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
            const eventName = foundEvent?.name ?? 'Неизвестное мероприятие'
            let dateTimeLabel: string | null = null
            if (foundTicket) {
                const d = new Date(foundTicket.event_date).toLocaleDateString('ru-RU')
                const t = foundTicket.event_time.slice(0, 5)
                dateTimeLabel = `${d}, ${t}`
            }
            return {booking: b, eventName, dateTimeLabel}
        })
    }, [bookings, events, ticketsByEvent])

    const grouped = useMemo(() => {
        const groups: Record<string, BookingWithMeta[]> = {}
        itemsWithMeta.forEach(item => {
            if (!groups[item.eventName]) groups[item.eventName] = []
            groups[item.eventName].push(item)
        })
        return groups
    }, [itemsWithMeta])

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-900">🎟 Мои билеты</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
                    {(loading || metaLoading) && (
                        <p className="text-indigo-500 text-sm">Загрузка...</p>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {!loading && bookings.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <span className="text-4xl block mb-2">🎭</span>
                            <p>Нет активных бронирований</p>
                        </div>
                    )}

                    {Object.entries(grouped).map(([eventName, items]) => (
                        <details key={eventName} className="border border-gray-200 rounded-xl bg-white/60" open>
                            <summary className="flex items-center justify-between p-3 cursor-pointer select-none">
                                <span className="font-semibold text-sm">{eventName}</span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
                            </summary>
                            <div className="border-t px-3 py-2 space-y-2">
                                {items.map(({booking, dateTimeLabel}) => (
                                    <BookingItem
                                        key={booking.id}
                                        booking={booking}
                                        onCancel={cancel}
                                        eventDateTime={dateTimeLabel ?? undefined}
                                    />
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </Drawer>
    )
})
