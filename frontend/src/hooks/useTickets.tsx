import {useState, useEffect, useCallback} from "react"
import type {Ticket} from "../../../shared"
import {getTicketsByEvent, clearTicketCache} from "../services/bookingService"

export const useTickets = (eventId: number) => {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadTickets = useCallback(async () => {
        if (!eventId) {
            setTickets([])
            return
        }

        try {
            setLoading(true)
            setError(null)
            // Очищаем кэш перед загрузкой для свежих данных
            clearTicketCache(eventId)
            const data = await getTicketsByEvent(eventId)
            setTickets(data)
        } catch (err) {
            setError("Ошибка при загрузке билетов")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [eventId])

    useEffect(() => {
        loadTickets()
    }, [loadTickets])

    const getDates = (eventId: number) => {
        return [...new Set(tickets
            .filter(t => t.event_id === eventId)
            .map(t => new Date(t.event_date).toDateString())
        )]
    }

    const getTimesByDate = (eventId: number, date: string) => {
        return tickets.filter(t => 
            t.event_id === eventId && 
            new Date(t.event_date).toDateString() === new Date(date).toDateString()
        )
    }

    return {tickets, loading, error, getDates, getTimesByDate, refresh: loadTickets}
}