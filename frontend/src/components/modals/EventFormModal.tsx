import {useEffect, useState} from "react"
import {Modal} from "../ui/Modal"
import {Input} from "../ui/Input"
import {Button} from "../ui/Button"
import {createTicket, deleteTicket, getTicketsByEvent, updateTicket} from "../../services/bookingService"
import type {Ticket} from "../../../../shared/ticket"

interface EventFormData {
    name: string
    description?: string
    photo?: string
    duration: number
    isAvailable: boolean
}

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: EventFormData) => void
    initialData?: Partial<EventFormData> & { id?: number; is_available?: boolean }
}

export const EventFormModal = ({
                                   isOpen,
                                   onClose,
                                   onSubmit,
                                   initialData
                               }: Props) => {
    const [name, setName] = useState(initialData?.name ?? "")
    const [description, setDescription] = useState(initialData?.description ?? "")
    const [photo, setPhoto] = useState(initialData?.photo ?? "")
    const [duration, setDuration] = useState(initialData?.duration ?? 60)
    const [isAvailable, setIsAvailable] = useState<boolean>(initialData?.is_available ?? true)

    const [tickets, setTickets] = useState<Ticket[]>([])
    const [ticketsLoading, setTicketsLoading] = useState(false)
    const [ticketsError, setTicketsError] = useState<string | null>(null)

    const [newDate, setNewDate] = useState("")
    const [newTime, setNewTime] = useState("")
    const [newPrice, setNewPrice] = useState<number>(0)
    const [newQuantity, setNewQuantity] = useState<number>(0)

    const eventId = initialData?.id

    useEffect(() => {
        if (!isOpen) return
        setName(initialData?.name ?? "")
        setDescription(initialData?.description ?? "")
        setPhoto(initialData?.photo ?? "")
        setDuration(initialData?.duration ?? 60)
        setIsAvailable(initialData?.is_available ?? true)
    }, [isOpen, initialData])

    useEffect(() => {
        if (!isOpen || !eventId) return

        const loadTickets = async () => {
            try {
                setTicketsLoading(true)
                setTicketsError(null)
                const data = await getTicketsByEvent(eventId)
                setTickets(data)
            } catch (e) {
                setTicketsError("Не удалось загрузить билеты для мероприятия")
            } finally {
                setTicketsLoading(false)
            }
        }

        loadTickets()
    }, [isOpen, eventId])

    const handleSubmit = () => {
        onSubmit({
            name: name.trim(),
            description: description.trim() || undefined,
            photo: photo.trim() || undefined,
            duration,
            isAvailable,
        })
        onClose()
    }

    const handleCreateTicket = async () => {
        if (!eventId || !newDate || !newTime || newQuantity <= 0 || newPrice <= 0) return
        try {
            setTicketsError(null)
            const dto = {
                event_id: eventId,
                event_date: new Date(newDate),
                event_time: newTime,
                price: newPrice,
                quantity: newQuantity,
            }
            const created = await createTicket(dto as any)
            setTickets(prev => [...prev, created])
            setNewDate("")
            setNewTime("")
            setNewPrice(0)
            setNewQuantity(0)
        } catch (e) {
            setTicketsError("Ошибка при создании билетов")
        }
    }

    const handleUpdateTicket = async (ticket: Ticket, index: number) => {
        try {
            setTicketsError(null)
            const dto = {
                event_date: new Date(ticket.event_date),
                event_time: ticket.event_time,
                price: ticket.price,
                quantity: ticket.quantity,
            }
            const updated = await updateTicket(ticket.id, dto as any)
            setTickets(prev => prev.map((t, i) => (i === index ? updated : t)))
        } catch (e) {
            setTicketsError("Ошибка при обновлении билета")
        }
    }

    const handleDeleteTicket = async (ticketId: number) => {
        if (!window.confirm("Удалить этот билет?")) return
        try {
            setTicketsError(null)
            await deleteTicket(ticketId)
            setTickets(prev => prev.filter(t => t.id !== ticketId))
        } catch (e) {
            setTicketsError("Ошибка при удалении билета")
        }
    }

    const title = initialData ? "Редактирование мероприятия" : "Новое мероприятие"
    const buttonLabel = initialData ? "Сохранить" : "Создать"

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">{title}</h2>

                <div className="space-y-3">
                    <Input
                        placeholder="Название"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Описание"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <Input
                        placeholder="Ссылка на обложку"
                        value={photo}
                        onChange={e => setPhoto(e.target.value)}
                    />
                    <Input
                        type="number"
                        value={duration}
                        onChange={e => setDuration(Number(e.target.value))}
                    />

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={e => setIsAvailable(e.target.checked)}
                        />
                        <span>Событие доступно для пользователей</span>
                    </label>
                </div>

                {eventId && (
                    <div className="space-y-3 border-t pt-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🎟</span>
                                <span className="font-semibold">Билеты</span>
                            </div>
                        </div>

                        {ticketsError && (
                            <p className="text-sm text-red-500">{ticketsError}</p>
                        )}

                        {ticketsLoading && (
                            <p className="text-sm text-blue-500">Загрузка билетов...</p>
                        )}

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {tickets.map((t, index) => {
                                const dateValue = new Date(t.event_date).toISOString().slice(0, 10)
                                return (
                                    <div
                                        key={t.id}
                                        className="grid grid-cols-5 gap-2 items-end border rounded-xl p-2 bg-gray-50"
                                    >
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-500">Дата</label>
                                            <Input
                                                type="date"
                                                value={dateValue}
                                                onChange={e => {
                                                    const next = [...tickets]
                                                    next[index] = {
                                                        ...next[index],
                                                        event_date: new Date(e.target.value) as any,
                                                    }
                                                    setTickets(next)
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Время</label>
                                            <Input
                                                type="time"
                                                value={t.event_time.slice(0, 5)}
                                                onChange={e => {
                                                    const next = [...tickets]
                                                    next[index] = {
                                                        ...next[index],
                                                        event_time: e.target.value,
                                                    }
                                                    setTickets(next)
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Цена</label>
                                            <Input
                                                type="number"
                                                value={t.price}
                                                onChange={e => {
                                                    const next = [...tickets]
                                                    next[index] = {
                                                        ...next[index],
                                                        price: Number(e.target.value),
                                                    }
                                                    setTickets(next)
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Количество</label>
                                            <Input
                                                type="number"
                                                value={t.quantity}
                                                onChange={e => {
                                                    const next = [...tickets]
                                                    next[index] = {
                                                        ...next[index],
                                                        quantity: Number(e.target.value),
                                                    }
                                                    setTickets(next)
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-5 flex justify-end gap-2 pt-1">
                                            <Button
                                                variant="primary"
                                                onClick={() => handleUpdateTicket(t, index)}
                                            >
                                                Сохранить
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteTicket(t.id)}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}

                            {tickets.length === 0 && !ticketsLoading && (
                                <p className="text-sm text-gray-500">
                                    Пока нет билетов для этого мероприятия.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 border-t pt-2">
                            <p className="text-sm font-medium">Добавить новую «пачку» билетов</p>
                            <div className="grid grid-cols-5 gap-2 items-end">
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500">Дата</label>
                                    <Input
                                        type="date"
                                        value={newDate}
                                        onChange={e => setNewDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Время</label>
                                    <Input
                                        type="time"
                                        value={newTime}
                                        onChange={e => setNewTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Цена</label>
                                    <Input
                                        type="number"
                                        value={newPrice}
                                        onChange={e => setNewPrice(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Количество</label>
                                    <Input
                                        type="number"
                                        value={newQuantity}
                                        onChange={e => setNewQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-5 flex justify-end">
                                    <Button onClick={handleCreateTicket}>
                                        Добавить билеты
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!eventId && (
                    <p className="text-xs text-gray-500">
                        После создания мероприятия вы сможете добавить для него билеты в режиме редактирования.
                    </p>
                )}

                <div className="pt-2">
                    <Button onClick={handleSubmit}>
                        {buttonLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}