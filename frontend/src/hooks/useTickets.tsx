import {useEffect} from "react"
import {ticketStore} from "../stores/ticketStore"

export const useTickets = (eventId: number) => {
    useEffect(() => {
        ticketStore.fetchTickets(eventId).catch(() => {
        })
    }, [eventId])

    const tickets = eventId ? ticketStore.ticketsByEvent.get(eventId) || [] : []
    const loading = ticketStore.loading
    const error = ticketStore.error

    const getDates = (evId: number) => {
        const list = ticketStore.ticketsByEvent.get(evId) || []
        return [...new Set(list.map(t => new Date(t.event_date).toDateString()))]
    }

    const getTimesByDate = (evId: number, date: string) => {
        const list = ticketStore.ticketsByEvent.get(evId) || []
        return list.filter(t => new Date(t.event_date).toDateString() === new Date(date).toDateString())
    }

    return {
        tickets,
        loading,
        error,
        getDates,
        getTimesByDate,
        refresh: (force = false) => ticketStore.fetchTickets(eventId, force)
    }
}