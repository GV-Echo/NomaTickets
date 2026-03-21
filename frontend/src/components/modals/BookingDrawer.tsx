import {useEffect, useMemo, useState} from "react"
import {Drawer} from "../ui/Drawer"
import {useBookings} from "../../hooks/useBooking"
import {BookingItem} from "../booking/BookingItem"
import { useGetEventsQuery, useGetTicketsByEventQuery } from '../../api/bookingApi'
import type {Event} from "../../../../shared/event.ts"
import type {Ticket} from "../../../../shared/ticket.ts"

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
    const { data: events = [], isLoading: eventsLoading } = useGetEventsQuery()
    const [metaLoading, setMetaLoading] = useState(false)
    const [metaError, setMetaError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            refresh()
        }
    }, [isOpen, refresh])

    useEffect(() => {
        // events are loaded via RTK Query hook
        if (!isOpen) return
        // nothing else to do here; tickets will be loaded per-booking in child hook
    }, [isOpen, bookings])

    const itemsWithMeta: BookingWithMeta[] = useMemo(() => {
        return bookings.map(b => {
            const foundEvent = events.find(e => e.id === (b as any).event_id) || events.find(e => e.id === (b as any).eventId) || events.find(e => e.id === b.ticket_id)

            const eventName = foundEvent?.name ?? 'Неизвестное мероприятие'

            return {
                booking: b,
                eventName,
                dateTimeLabel: null,
            }
        })
    }, [bookings, events])

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
                                    {items.map(({booking}) => (
                                        <BookingMeta
                                            key={booking.id}
                                            booking={booking}
                                            onCancel={cancel}
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

const BookingMeta = ({ booking, onCancel }: { booking: import('../../../../shared/booking').Booking; onCancel: (id: number) => void }) => {
    const ticketId = booking.ticket_id
    // We don't have an endpoint to fetch ticket by id directly, so fetch tickets by event is used in BookingModal elsewhere.
    // Here we'll attempt to derive event date/time by fetching tickets for the booking's event via query that may be cached.
    // As a fallback we'll render without date/time.
    // Try to fetch tickets for eventId by inspecting booking (no direct eventId available) — skip and show minimal info.

    const eventDateTime = undefined

    return (
        <BookingItem
            booking={booking}
            onCancel={onCancel}
            eventDateTime={eventDateTime}
        />
    )
}