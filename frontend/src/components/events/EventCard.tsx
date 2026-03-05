import {useState} from "react"
import type {Event} from "../../../../shared/event.ts"
import {BookingModal} from "../modals/BookingModal.tsx"
import {Button} from "../ui/Button.tsx"
import {EventImage} from "./EventImage.tsx";
import {useAuth} from "../../hooks/useAuth.tsx"

interface Props {
    event: Event
    onEdit?: (event: Event) => void
    onDelete?: (event: Event) => void
}

export const EventCard = ({event, onEdit, onDelete}: Props) => {
    const {user} = useAuth()
    const [isModalOpen, setModalOpen] = useState(false)
    const isAdmin = user?.is_admin

    return (
        <>
            <div
                className="p-6 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition bg-white/60 border border-gray-100 flex flex-col justify-between min-w-50"
            >
                <div className="space-y-3">
                    <EventImage photo={event.photo ?? undefined} name={event.name}/>

                    <h3 className="text-xl font-semibold">{event.name}</h3>
                    {event.description && (
                        <p className="text-sm text-gray-500">Описание: {event.description}</p>
                    )}
                    <p className="text-sm text-gray-500">Длительность: {event.duration} мин</p>
                </div>

                <div className="mt-4 flex gap-2">
                    {!isAdmin && (
                        <Button
                            variant="success"
                            className="flex-1 flex items-center justify-center gap-2"
                            onClick={() => setModalOpen(true)}
                        >
                            <span>Забронировать</span>
                        </Button>
                    )}

                    {isAdmin && (
                        <>
                            <Button
                                variant="primary"
                                className="flex-1 flex items-center justify-center gap-2"
                                onClick={() => onEdit?.(event)}
                            >
                                <span>Редактировать</span>
                            </Button>
                            <Button
                                variant="danger"
                                className="flex-1 flex items-center justify-center gap-2"
                                onClick={() => onDelete?.(event)}
                            >
                                <span>Удалить</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {!isAdmin && (
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    event={event}
                />
            )}
        </>
    )
}
