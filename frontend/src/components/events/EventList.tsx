import {useEffect, useState} from 'react'
import type {Event} from "../../../../shared/event.ts"
import {EventCard} from "./EventCard.tsx"
import {useAuth} from "../../hooks/useAuth.tsx"
import {Button} from "../ui/Button.tsx"
import {EventFormModal} from "../modals/EventFormModal.tsx"
import {createEvent, deleteEvent, getAllEvents, updateEvent} from '../../services/bookingService.ts'

export const EventList = () => {
    const {user} = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    useEffect(() => {
        async function loadEvents() {
            try {
                setError(null)
                const data = await getAllEvents()
                setEvents(data)
            } catch (e) {
                setError("Не удалось загрузить мероприятия")
            } finally {
                setLoading(false)
            }
        }

        loadEvents()
    }, [])

    const handleCreate = async (data: { name: string; description?: string; photo?: string; duration: number; isAvailable: boolean }) => {
        try {
            setError(null)
            const {isAvailable, ...payload} = data
            const created = await createEvent(payload)
            setEvents(prev => [...prev, created])
        } catch (e) {
            setError("Ошибка при создании мероприятия")
        }
    }

    const handleStartEdit = (event: Event) => {
        setEditingEvent(event)
        setIsEditOpen(true)
    }

    const handleEdit = async (data: { name: string; description?: string; photo?: string; duration: number; isAvailable: boolean }) => {
        if (!editingEvent) return
        try {
            setError(null)
            const updated = await updateEvent(editingEvent.id, {
                name: data.name,
                description: data.description,
                photo: data.photo,
                duration: data.duration,
                is_available: data.isAvailable,
            })
            setEvents(prev => prev.map(e => e.id === updated.id ? updated : e))
        } catch (e) {
            setError("Ошибка при обновлении мероприятия")
        } finally {
            setIsEditOpen(false)
            setEditingEvent(null)
        }
    }

    const handleDelete = async (event: Event) => {
        if (!window.confirm(`Удалить мероприятие "${event.name}"?`)) return
        try {
            setError(null)
            await deleteEvent(event.id)
            setEvents(prev => prev.filter(e => e.id !== event.id))
        } catch (e) {
            setError("Ошибка при удалении мероприятия")
        }
    }

    if (loading) return <div>Загрузка...</div>

    const visibleEvents = user?.is_admin
        ? events
        : events.filter(e => e.is_available)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Мероприятия</h2>
                {user?.is_admin && (
                    <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
                        <span className="mr-2">+</span>
                        Добавить мероприятие
                    </Button>
                )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="grid md:grid-cols-4 gap-10">
                {visibleEvents.map((e) => (
                    <EventCard
                        key={e.id}
                        event={e}
                        onEdit={user?.is_admin ? handleStartEdit : undefined}
                        onDelete={user?.is_admin ? handleDelete : undefined}
                    />
                ))}
            </div>

            {user?.is_admin && (
                <>
                    <EventFormModal
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreate}
                    />

                    {editingEvent && (
                        <EventFormModal
                            isOpen={isEditOpen}
                            onClose={() => {
                                setIsEditOpen(false)
                                setEditingEvent(null)
                            }}
                            initialData={{
                                id: editingEvent.id,
                                name: editingEvent.name,
                                description: editingEvent.description ?? undefined,
                                photo: editingEvent.photo ?? undefined,
                                duration: editingEvent.duration,
                                is_available: editingEvent.is_available,
                            }}
                            onSubmit={handleEdit}
                        />
                    )}
                </>
            )}
        </div>
    )
}