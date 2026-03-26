import {useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Modal} from '../ui/Modal'
import {Input} from '../ui/Input'
import {Button} from '../ui/Button'
import {adminStore} from '../../stores/adminStore'
import type {Event, Ticket, CreateTicketDto, UpdateTicketDto} from '../../types'

interface Props {
    isOpen: boolean
    onClose: () => void
    event?: Event | null  // null = режим создания, Event = режим редактирования
}

const toLocalDate = (val: unknown): string => {
    const d = new Date(val as string)
    if (isNaN(d.getTime())) return ''
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const EventFormModal = observer(({isOpen, onClose, event}: Props) => {
    const isEdit = !!event

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [photo, setPhoto] = useState('')
    const [duration, setDuration] = useState(60)
    const [isAvailable, setIsAvailable] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [newDate, setNewDate] = useState('')
    const [newTime, setNewTime] = useState('')
    const [newPrice, setNewPrice] = useState(0)
    const [newQty, setNewQty] = useState(0)
    const [ticketError, setTicketError] = useState<string | null>(null)

    const [localTickets, setLocalTickets] = useState<Ticket[]>([])

    useEffect(() => {
        if (!isOpen) return
        setName(event?.name ?? '')
        setDescription(event?.description ?? '')
        setPhoto(event?.photo ?? '')
        setDuration(event?.duration ?? 60)
        setIsAvailable(event?.is_available ?? true)
        setError(null)
        setTicketError(null)
        setNewDate('');
        setNewTime('');
        setNewPrice(0);
        setNewQty(0)
    }, [isOpen, event])

    useEffect(() => {
        if (isOpen && event?.id) {
            adminStore.fetchTickets(event.id).then(tickets => {
                setLocalTickets([...tickets])
            })
        } else {
            setLocalTickets([])
        }
    }, [isOpen, event?.id])

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Введите название');
            return
        }
        setSubmitting(true)
        setError(null)
        try {
            if (isEdit && event) {
                await adminStore.updateEvent(event.id, {
                    name: name.trim(),
                    description: description.trim() || undefined,
                    photo: photo.trim() || undefined,
                    duration,
                    is_available: isAvailable,
                })
            } else {
                await adminStore.createEvent({
                    name: name.trim(),
                    description: description.trim() || undefined,
                    photo: photo.trim() || undefined,
                    duration,
                })
            }
            onClose()
        } catch {
            setError('Ошибка при сохранении мероприятия')
        } finally {
            setSubmitting(false)
        }
    }

    const handleAddTicket = async () => {
        if (!event?.id) return
        if (!newDate || !newTime || newPrice <= 0 || newQty <= 0) {
            setTicketError('Заполните все поля билета корректно')
            return
        }
        setTicketError(null)
        try {
            const dto: CreateTicketDto = {
                event_id: event.id,
                event_date: newDate,
                event_time: newTime.slice(0, 5),
                price: newPrice,
                quantity: newQty,
            }
            const created = await adminStore.createTicket(dto)
            setLocalTickets(prev => [...prev, created])
            setNewDate('');
            setNewTime('');
            setNewPrice(0);
            setNewQty(0)
        } catch {
            setTicketError('Ошибка при добавлении билетов')
        }
    }

    const handleUpdateTicket = async (ticket: Ticket, idx: number) => {
        if (!event?.id) return
        setTicketError(null)
        try {
            const dto: UpdateTicketDto = {
                event_date: toLocalDate(ticket.event_date) || undefined,
                event_time: ticket.event_time.slice(0, 5),
                price: Number(ticket.price),
                quantity: Number(ticket.quantity),
            }
            const updated = await adminStore.updateTicket(ticket.id, event.id, dto)
            setLocalTickets(prev => prev.map((t, i) => i === idx ? updated : t))
        } catch {
            setTicketError('Ошибка при обновлении билета')
        }
    }

    const handleDeleteTicket = async (ticketId: number) => {
        if (!event?.id) return
        if (!window.confirm('Удалить этот билет?')) return
        setTicketError(null)
        try {
            await adminStore.deleteTicket(ticketId, event.id)
            setLocalTickets(prev => prev.filter(t => t.id !== ticketId))
        } catch {
            setTicketError('Ошибка при удалении билета')
        }
    }

    const title = isEdit ? 'Редактирование мероприятия' : 'Новое мероприятие'

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                {/* Основные поля */}
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                        <Input placeholder="Название мероприятия" value={name} onChange={e => setName(e.target.value)}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <Input placeholder="Краткое описание" value={description}
                               onChange={e => setDescription(e.target.value)}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на обложку</label>
                        <Input type="url" placeholder="https://..." value={photo}
                               onChange={e => setPhoto(e.target.value)}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Длительность (мин)</label>
                        <Input type="number" min={1} value={duration}
                               onChange={e => setDuration(Number(e.target.value))}/>
                    </div>
                    {isEdit && (
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                                type="checkbox" checked={isAvailable}
                                onChange={e => setIsAvailable(e.target.checked)}
                                className="w-4 h-4 accent-indigo-600"
                            />
                            Мероприятие доступно для пользователей
                        </label>
                    )}
                </div>

                {error && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>
                )}

                {/* Билеты — только в режиме редактирования */}
                {isEdit && event && (
                    <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-base">🎟</span>
                            <h4 className="font-semibold text-gray-900">Билеты</h4>
                            {adminStore.loadingTickets &&
                                <span className="text-xs text-indigo-500 ml-auto">Загрузка...</span>}
                        </div>

                        {ticketError && (
                            <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{ticketError}</p>
                        )}

                        {/* Список билетов */}
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {localTickets.map((t, idx) => (
                                <div key={t.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                                    <div className="grid grid-cols-4 gap-2 mb-2">
                                        <div>
                                            <label className="text-xs text-gray-500">Дата</label>
                                            <Input
                                                type="date" value={toLocalDate(t.event_date)}
                                                onChange={e => setLocalTickets(prev => {
                                                    const n = [...prev];
                                                    n[idx] = {...n[idx], event_date: e.target.value};
                                                    return n
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Время</label>
                                            <Input
                                                type="time" value={t.event_time.slice(0, 5)}
                                                onChange={e => setLocalTickets(prev => {
                                                    const n = [...prev];
                                                    n[idx] = {...n[idx], event_time: e.target.value};
                                                    return n
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Цена (₽)</label>
                                            <Input
                                                type="number" value={t.price}
                                                onChange={e => setLocalTickets(prev => {
                                                    const n = [...prev];
                                                    n[idx] = {...n[idx], price: Number(e.target.value)};
                                                    return n
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Кол-во</label>
                                            <Input
                                                type="number" value={t.quantity}
                                                onChange={e => setLocalTickets(prev => {
                                                    const n = [...prev];
                                                    n[idx] = {...n[idx], quantity: Number(e.target.value)};
                                                    return n
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline"
                                                onClick={() => handleUpdateTicket(t, idx)}>Сохранить</Button>
                                        <Button variant="danger"
                                                onClick={() => handleDeleteTicket(t.id)}>Удалить</Button>
                                    </div>
                                </div>
                            ))}
                            {localTickets.length === 0 && !adminStore.loadingTickets && (
                                <p className="text-sm text-gray-400 text-center py-4">Билетов пока нет</p>
                            )}
                        </div>

                        {/* Форма добавления нового билета */}
                        <div
                            className="border border-dashed border-indigo-300 rounded-xl p-3 space-y-2 bg-indigo-50/30">
                            <p className="text-sm font-medium text-gray-700">Добавить партию билетов</p>
                            <div className="grid grid-cols-4 gap-2">
                                <div>
                                    <label className="text-xs text-gray-500">Дата</label>
                                    <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Время</label>
                                    <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Цена (₽)</label>
                                    <Input type="number" min={0} value={newPrice}
                                           onChange={e => setNewPrice(Number(e.target.value))}/>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Кол-во</label>
                                    <Input type="number" min={0} value={newQty}
                                           onChange={e => setNewQty(Number(e.target.value))}/>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="primary" onClick={handleAddTicket}>+ Добавить</Button>
                            </div>
                        </div>
                    </div>
                )}

                {!isEdit && (
                    <p className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                        После создания мероприятия откройте его редактирование, чтобы добавить билеты.
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t">
                    <Button variant="ghost" onClick={onClose}>Отмена</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать мероприятие'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
})
