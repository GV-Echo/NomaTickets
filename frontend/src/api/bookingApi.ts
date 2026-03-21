import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Event } from '../../../shared/event.ts'
import type { Ticket } from '../../../shared/ticket.ts'
import type { Booking } from '../../../shared/booking.ts'

const baseUrl = import.meta.env.VITE_BOOKING_API_URL as string

const baseQuery = fetchBaseQuery({ baseUrl, credentials: 'include' })

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery,
  tagTypes: ['Events', 'Tickets', 'Bookings'],
  endpoints: (build) => ({
    getEvents: build.query<Event[], void>({
      query: () => ({ url: '/events' }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Events' as const, id })), { type: 'Events', id: 'LIST' }]
          : [{ type: 'Events', id: 'LIST' }],
    }),
    createEvent: build.mutation<Event, Partial<Event>>({
      query: (body) => ({ url: '/events', method: 'POST', body }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),
    updateEvent: build.mutation<Event, { id: number; body: Partial<Event> }>({
      query: ({ id, body }) => ({ url: `/events/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'Events', id: arg.id }],
    }),
    deleteEvent: build.mutation<void, number>({
      query: (id) => ({ url: `/events/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),
    // Tickets
    getTicketsByEvent: build.query<Ticket[], number>({
      query: (eventId) => ({ url: `/tickets/event/${eventId}` }),
      providesTags: (result, error, arg) => [{ type: 'Tickets', id: `EVENT_${arg}` }],
    }),
    createTicket: build.mutation<Ticket, Partial<Ticket & { event_id: number }>>({
      query: (body) => ({ url: '/tickets', method: 'POST', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'Tickets', id: `EVENT_${arg.event_id}` }],
    }),
    updateTicket: build.mutation<Ticket, { id: number; body: Partial<Ticket> }>({
      query: ({ id, body }) => ({ url: `/tickets/${id}`, method: 'PATCH', body }),
      invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
    }),
    deleteTicket: build.mutation<void, { id: number; eventId?: number }>({
      query: ({ id }) => ({ url: `/tickets/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => (arg.eventId ? [{ type: 'Tickets', id: `EVENT_${arg.eventId}` }] : [{ type: 'Tickets', id: 'LIST' }]),
    }),
    getAvailableDates: build.query<string[], number>({
      query: (eventId) => ({ url: `/tickets/event/${eventId}/dates` }),
      providesTags: (result, error, arg) => [{ type: 'Tickets', id: `DATES_${arg}` }],
    }),
    getTicketsByDate: build.query<Ticket[], { eventId: number; date: string }>({
      query: ({ eventId, date }) => ({ url: `/tickets/event/${eventId}/by-date`, params: { date } }),
      providesTags: (result, error, arg) => [{ type: 'Tickets', id: `EVENT_${arg.eventId}_DATE_${arg.date}` }],
    }),
    // Bookings
    createBooking: build.mutation<Booking, { ticket_id: number; user_id: number }>({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'Bookings', id: `USER_${arg.user_id}` }, { type: 'Tickets', id: 'LIST' }],
    }),
    getMyBookings: build.query<Booking[], number>({
      query: (userId) => ({ url: `/bookings/user/${userId}` }),
      providesTags: (result, error, arg) => [{ type: 'Bookings', id: `USER_${arg}` }],
    }),
    cancelBooking: build.mutation<Booking, number>({
      query: (id) => ({ url: `/bookings/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetTicketsByEventQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetAvailableDatesQuery,
  useGetTicketsByDateQuery,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} = bookingApi
