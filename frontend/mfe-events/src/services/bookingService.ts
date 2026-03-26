import axios from 'axios'
import type {Event, Ticket, Booking} from '../types'

export const bookingApi = axios.create({
    baseURL: '/booking',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true,
})

// Events
export const getAllEvents = async (): Promise<Event[]> => {
    const {data} = await bookingApi.get<Event[]>('/events')
    return data
}

// Tickets
export const getTicketsByEvent = async (eventId: number): Promise<Ticket[]> => {
    const {data} = await bookingApi.get<Ticket[]>(`/tickets/event/${eventId}`)
    return data
}

// Bookings
export const createBooking = async (ticketId: number, userId: number): Promise<Booking> => {
    const {data} = await bookingApi.post<Booking>('/bookings', {
        ticket_id: ticketId,
        user_id: userId,
    })
    return data
}

export const getMyBookings = async (userId: number): Promise<Booking[]> => {
    const {data} = await bookingApi.get<Booking[]>(`/bookings/user/${userId}`)
    return data
}

export const cancelBooking = async (id: number): Promise<Booking> => {
    const {data} = await bookingApi.patch<Booking>(`/bookings/${id}/cancel`)
    return data
}
