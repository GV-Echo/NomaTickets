import {useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {EventCard} from './EventCard'
import {BookingDrawer} from '../modals/BookingDrawer'
import {Button} from '../ui/Button'
import {useAuth} from '../../hooks/useAuth'
import {eventStore} from '../../stores/eventStore'
import type {Event} from '../../types'

export const EventList = observer(() => {
    const {user} = useAuth()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    useEffect(() => {
        eventStore.fetchEvents().catch(() => {
        })
    }, [])

    const visibleEvents: Event[] = user?.is_admin
        ? eventStore.events
        : eventStore.events.filter(e => e.is_available)

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Мероприятия</h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {eventStore.loading ? 'Загрузка...' : `${visibleEvents.length} доступно`}
                    </p>
                </div>

                <Button variant="ghost" onClick={() => setIsDrawerOpen(true)}>
                    🎟 Мои билеты
                </Button>
            </div>

            {eventStore.error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    {eventStore.error}
                </p>
            )}

            {!eventStore.loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visibleEvents.map(event => (
                        <EventCard key={event.id} event={event}/>
                    ))}
                    {visibleEvents.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            <span className="text-5xl block mb-3">🎭</span>
                            <p>Нет доступных мероприятий</p>
                        </div>
                    )}
                </div>
            )}

            <BookingDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}/>
        </div>
    )
})
