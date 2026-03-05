import axios from 'axios'
import type { Event } from "../../../shared/event.ts"
import type { Ticket } from "../../../shared/ticket.ts"
import type { Booking } from "../../../shared/booking.ts"

export const api = axios.create({
    baseURL: import.meta.env.VITE_BOOKING_API_URL as string,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Events
export async function getAllEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events')
    return response.data
}

// Tickets
const ticketsCache = new Map<number, Ticket[]>()

export async function getTicketsByEvent(eventId: number): Promise<Ticket[]> {
    if (ticketsCache.has(eventId)) {
        return ticketsCache.get(eventId)!
    }

    const response = await api.get<Ticket[]>(`/tickets/event/${eventId}`)
    ticketsCache.set(eventId, response.data)

    return response.data
}

export async function getAvailableDates(eventId: number): Promise<string[]> {
    const response = await api.get<string[]>(`/tickets/event/${eventId}/dates`)
    return response.data
}

export async function getTicketsByDate(
    eventId: number,
    date: string
): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>(
        `/tickets/event/${eventId}/by-date`,
        { params: { date } }
    )
    return response.data
}

// Booking
export async function createBooking(ticketId: number, userId: number): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', {
        ticket_id: ticketId,
        user_id: userId,
    })
    return response.data
}

export async function getMyBookings(userId: number): Promise<Booking[]> {
    const response = await api.get<Booking[]>(`/bookings/user/${userId}`)
    return response.data
}

export async function cancelBooking(id: number): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`)
    return response.data
}