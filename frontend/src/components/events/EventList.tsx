import {EventCard} from "./EventCard.tsx"
import { useEffect, useState } from 'react'
import { getAllEvents } from '../../services/bookingService.ts'
import type { Event } from "../../../../shared/event.ts"

export const EventList = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getAllEvents()
                setEvents(data)
                console.log('Loaded events:', data)
            } finally {
                setLoading(false)
            }
        }

        loadEvents()
    }, [])
    if (loading) return <div>Загрузка...</div>


    return (
        <div className="grid md:grid-cols-4 gap-10">
            {events.map((e) => (
                <EventCard key={e.id} event={e}/>
            ))}
        </div>
    )
}