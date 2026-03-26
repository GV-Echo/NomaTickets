import axios from 'axios'
import type { Event, Ticket, CreateEventDto, UpdateEventDto, CreateTicketDto, UpdateTicketDto } from '../types'

export const bookingApi = axios.create({
  baseURL: '/booking',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Events(admin only)
export const getAllEvents = async (): Promise<Event[]> => {
  const { data } = await bookingApi.get<Event[]>('/events')
  return data
}

export const createEvent = async (dto: CreateEventDto): Promise<Event> => {
  const { data } = await bookingApi.post<Event>('/events', dto)
  return data
}

export const updateEvent = async (id: number, dto: UpdateEventDto): Promise<Event> => {
  const { data } = await bookingApi.patch<Event>(`/events/${id}`, dto)
  return data
}

export const deleteEvent = async (id: number): Promise<void> => {
  await bookingApi.delete(`/events/${id}`)
}

// Tickets(admin only)
export const getTicketsByEvent = async (eventId: number): Promise<Ticket[]> => {
  const { data } = await bookingApi.get<Ticket[]>(`/tickets/event/${eventId}`)
  return data
}

export const createTicket = async (dto: CreateTicketDto): Promise<Ticket> => {
  const { data } = await bookingApi.post<Ticket>('/tickets', dto)
  return data
}

export const updateTicket = async (id: number, dto: UpdateTicketDto): Promise<Ticket> => {
  const { data } = await bookingApi.patch<Ticket>(`/tickets/${id}`, dto)
  return data
}

export const deleteTicket = async (id: number): Promise<void> => {
  await bookingApi.delete(`/tickets/${id}`)
}
