import { useState } from 'react'
import type { Event } from "../../../../shared/event.ts"
import { EventCard } from "./EventCard.tsx"
import { useAuth } from "../../hooks/useAuth.tsx"
import { Button } from "../ui/Button.tsx"
import { EventFormModal } from "../modals/EventFormModal.tsx"
import { useGetEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from '../../api/bookingApi'

export const EventList = () => {
    const { user } = useAuth()
    const { data: events = [], isLoading, error } = useGetEventsQuery()
    const [createEvent] = useCreateEventMutation()
    const [updateEvent] = useUpdateEventMutation()
    const [deleteEvent] = useDeleteEventMutation()

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleCreate = async (data: { name: string; description?: string; photo?: string; duration: number; isAvailable: boolean }) => {
        try {
            const {isAvailable, ...payload} = data
            await createEvent(payload).unwrap()
        } catch (e) {
            // show error by your app's global error handling or keep simple
            console.error('Ошибка при создании мероприятия', e)
        }
    }

    const handleStartEdit = (event: Event) => {
        setEditingEvent(event)
        setIsEditOpen(true)
    }

    const handleEdit = async (data: { name: string; description?: string; photo?: string; duration: number; isAvailable: boolean }) => {
        if (!editingEvent) return
        try {
            await updateEvent({ id: editingEvent.id, body: {
                name: data.name,
                description: data.description,
                photo: data.photo,
                duration: data.duration,
                is_available: data.isAvailable,
            }}).unwrap()
        } catch (e) {
            console.error('Ошибка при обновлении мероприятия', e)
        } finally {
            setIsEditOpen(false)
            setEditingEvent(null)
        }
    }

    const handleDelete = async (event: Event) => {
        if (!window.confirm(`Удалить мероприятие "${event.name}"?`)) return
        try {
            await deleteEvent(event.id).unwrap()
        } catch (e) {
            console.error('Ошибка при удалении мероприятия', e)
        }
    }

    if (isLoading) return <div>Загрузка...</div>

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

            {error && <p className="text-red-500 text-sm">Ошибка загрузки мероприятий</p>}

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