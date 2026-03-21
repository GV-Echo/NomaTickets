import { useMemo } from 'react'
import type { Ticket } from '../../../shared/ticket.ts'
import { useGetTicketsByEventQuery, useGetTicketsByDateQuery } from '../api/bookingApi'

export const useTickets = (eventId: number) => {
  const { data: tickets = [], isLoading, error, refetch } = useGetTicketsByEventQuery(eventId, { skip: !eventId })

  const getDates = useMemo(() => {
    return (eventId ? [...new Set(tickets.filter(t => t.event_id === eventId).map(t => new Date(t.event_date).toDateString()) )] : [])
  }, [tickets, eventId])

  const getTimesByDate = (eventId: number, date: string) => {
    return tickets.filter(t => t.event_id === eventId && new Date(t.event_date).toDateString() === new Date(date).toDateString())
  }

  return { tickets, loading: isLoading, error: error ? String(error) : null, getDates, getTimesByDate, refresh: refetch }
}