import {useState} from 'react'
import {HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff} from 'react-icons/hi'
import {adminStore} from '../../stores/adminStore'
import {EventFormModal} from '../modals/EventFormModal'
import type {Event} from '../../types'

interface Props {
    event: Event
}

function extractError(e: unknown): string {
    const res = (e as {
        response?: { data?: { message?: string | string[]; error?: string }; status?: number }
    })?.response
    if (!res) return 'Нет соединения с сервером'
    const {data, status} = res
    if (data?.message) {
        return Array.isArray(data.message) ? data.message.join(', ') : data.message
    }
    if (data?.error) return `${status}: ${data.error}`
    return `Ошибка сервера (${status})`
}

export const EventAdminCard = ({event}: Props) => {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [toggling, setToggling] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleToggle = async () => {
        setToggling(true)
        setError(null)
        try {
            await adminStore.updateEvent(event.id, {
                name: event.name,
                description: event.description ?? undefined,
                photo: event.photo ?? undefined,
                duration: event.duration,
                is_available: !event.is_available,
            })
        } catch (e) {
            setError(extractError(e))
        } finally {
            setToggling(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Удалить мероприятие «${event.name}»?`)) return
        setDeleting(true)
        setError(null)
        try {
            await adminStore.deleteEvent(event.id)
        } catch (e) {
            setError(extractError(e))
            setDeleting(false)
        }
    }

    return (
        <>
            <div
                className={[
                    'bg-white rounded-2xl border shadow-sm flex flex-col transition-opacity',
                    deleting ? 'opacity-40 pointer-events-none' : '',
                    !event.is_available ? 'border-gray-200 opacity-75' : 'border-indigo-100',
                ].join(' ')}
            >
                {/* Обложка */}
                <div className="h-36 bg-gray-100 rounded-t-2xl overflow-hidden flex items-center justify-center">
                    {event.photo ? (
                        <img src={event.photo} alt={event.name} className="w-full h-full object-cover"/>
                    ) : (
                        <span className="text-4xl">🎭</span>
                    )}
                </div>

                {/* Контент */}
                <div className="p-4 flex-1 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                            {event.name}
                        </h3>
                        <span className={[
                            'shrink-0 text-xs px-2 py-0.5 rounded-full font-medium',
                            event.is_available
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-500',
                        ].join(' ')}>
              {event.is_available ? 'Активно' : 'Скрыто'}
            </span>
                    </div>

                    {event.description && (
                        <p className="text-gray-500 text-xs line-clamp-2">{event.description}</p>
                    )}

                    <p className="text-xs text-gray-400 mt-auto">{event.duration} мин</p>

                    {/* Реальная ошибка из ответа сервера */}
                    {error && (
                        <div
                            className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5 break-words">
                            <strong>Ошибка:</strong> {error}
                        </div>
                    )}
                </div>

                {/* Кнопки управления */}
                <div className="border-t px-4 py-3 flex items-center gap-2">
                    <button
                        onClick={() => {
                            setError(null);
                            setIsEditOpen(true)
                        }}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        <HiOutlinePencil size={14}/> Редактировать
                    </button>

                    <button
                        onClick={handleToggle}
                        disabled={toggling}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 ml-auto disabled:opacity-40"
                        title={event.is_available ? 'Скрыть от пользователей' : 'Показать пользователям'}
                    >
                        {toggling ? (
                            <span className="text-xs text-gray-400 animate-pulse">...</span>
                        ) : event.is_available ? (
                            <><HiOutlineEyeOff size={14}/> Скрыть</>
                        ) : (
                            <><HiOutlineEye size={14}/> Показать</>
                        )}
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 disabled:opacity-40"
                        title="Удалить мероприятие"
                    >
                        <HiOutlineTrash size={14}/>
                    </button>
                </div>
            </div>

            <EventFormModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                event={event}
            />
        </>
    )
}
