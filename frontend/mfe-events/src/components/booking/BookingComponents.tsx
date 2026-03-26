import {Input} from '../ui/Input'
import {Button} from '../ui/Button'
import type {Ticket, UserProfile} from '../../types'

interface DateSelectProps {
    dates: string[]
    selectedDate: string
    onChange: (date: string) => void
}

export const DateSelect = ({dates, selectedDate, onChange}: DateSelectProps) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
        <select
            value={selectedDate}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <option value="">Выберите дату</option>
            {dates.map((date) => (
                <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </option>
            ))}
        </select>
    </div>
)


interface TimeSelectProps {
    times: Ticket[]
    selectedTicketId: number | null
    onChange: (ticketId: number) => void
}

export const TimeSelect = ({times, selectedTicketId, onChange}: TimeSelectProps) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
        <select
            value={selectedTicketId ?? ''}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <option value="">Выберите время</option>
            {times.map((ticket) => (
                <option key={ticket.id} value={ticket.id} disabled={ticket.quantity === 0}>
                    {ticket.event_time.slice(0, 5)} — {ticket.price} ₽&nbsp;
                    (осталось: {ticket.quantity})
                </option>
            ))}
        </select>
    </div>
)


interface TicketSummaryProps {
    user: UserProfile
    quantity: number
    maxAllowed: number
    totalPrice: number
    isUnavailable: boolean
    isLoading?: boolean
    onQuantityChange: (value: number) => void
    onBuy: () => void
}

export const TicketSummary = ({
                                  user,
                                  quantity,
                                  maxAllowed,
                                  totalPrice,
                                  isUnavailable,
                                  isLoading = false,
                                  onQuantityChange,
                                  onBuy,
                              }: TicketSummaryProps) => (
    <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-sm">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Имя:</strong> {user.name}</p>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Количество билетов
                </label>
                <Input
                    type="number"
                    min={1}
                    max={maxAllowed}
                    value={quantity}
                    onChange={(e) =>
                        onQuantityChange(Math.min(Math.max(1, Number(e.target.value)), maxAllowed))
                    }
                />
                <p className="text-xs text-gray-500 mt-1">Максимум: {maxAllowed}</p>
            </div>
            <p className="text-base font-semibold">Итого: {totalPrice} ₽</p>
        </div>
        <Button
            variant="success"
            onClick={onBuy}
            disabled={isUnavailable || isLoading}
            className="w-full"
        >
            {isLoading ? 'Обработка...' : 'Купить'}
        </Button>
    </div>
)
