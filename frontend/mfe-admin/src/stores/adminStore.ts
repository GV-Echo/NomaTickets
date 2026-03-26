import {makeAutoObservable, runInAction} from 'mobx'
import {
    getAllEvents, createEvent, updateEvent, deleteEvent,
    getTicketsByEvent, createTicket, updateTicket, deleteTicket,
} from '../services/bookingService'
import type {Event, Ticket, CreateEventDto, UpdateEventDto, CreateTicketDto, UpdateTicketDto} from '../types'

class AdminStore {
    events: Event[] = []
    ticketsByEvent = new Map<number, Ticket[]>()
    selectedEventId: number | null = null

    loadingEvents = false
    loadingTickets = false
    errorEvents: string | null = null
    errorTickets: string | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get selectedEvent(): Event | undefined {
        return this.events.find(e => e.id === this.selectedEventId)
    }

    get currentTickets(): Ticket[] {
        return this.selectedEventId ? this.ticketsByEvent.get(this.selectedEventId) ?? [] : []
    }

    selectEvent(id: number | null) {
        this.selectedEventId = id
    }

    // Events
    async fetchEvents() {
        this.loadingEvents = true
        this.errorEvents = null
        try {
            const data = await getAllEvents()
            runInAction(() => {
                this.events = data
            })
        } catch {
            runInAction(() => {
                this.errorEvents = 'Не удалось загрузить мероприятия'
            })
        } finally {
            runInAction(() => {
                this.loadingEvents = false
            })
        }
    }

    async createEvent(dto: CreateEventDto) {
        const created = await createEvent(dto)
        runInAction(() => {
            this.events.push(created)
        })
        return created
    }

    async updateEvent(id: number, dto: UpdateEventDto) {
        const updated = await updateEvent(id, dto)
        runInAction(() => {
            const idx = this.events.findIndex(e => e.id === id)
            if (idx >= 0) this.events[idx] = updated
        })
        return updated
    }

    async deleteEvent(id: number) {
        await deleteEvent(id)
        runInAction(() => {
            this.events = this.events.filter(e => e.id !== id)
            if (this.selectedEventId === id) this.selectedEventId = null
        })
    }

    // Tickets
    async fetchTickets(eventId: number) {
        this.loadingTickets = true
        this.errorTickets = null
        try {
            const data = await getTicketsByEvent(eventId)
            runInAction(() => {
                this.ticketsByEvent.set(eventId, data)
            })
            return data
        } catch {
            runInAction(() => {
                this.errorTickets = 'Не удалось загрузить билеты'
            })
            return []
        } finally {
            runInAction(() => {
                this.loadingTickets = false
            })
        }
    }

    async createTicket(dto: CreateTicketDto) {
        const created = await createTicket(dto)
        runInAction(() => {
            const existing = this.ticketsByEvent.get(dto.event_id) ?? []
            this.ticketsByEvent.set(dto.event_id, [...existing, created])
        })
        return created
    }

    async updateTicket(id: number, eventId: number, dto: UpdateTicketDto) {
        const updated = await updateTicket(id, dto)
        runInAction(() => {
            const tickets = this.ticketsByEvent.get(eventId) ?? []
            const idx = tickets.findIndex(t => t.id === id)
            if (idx >= 0) tickets[idx] = updated
            this.ticketsByEvent.set(eventId, [...tickets])
        })
        return updated
    }

    async deleteTicket(id: number, eventId: number) {
        await deleteTicket(id)
        runInAction(() => {
            const tickets = (this.ticketsByEvent.get(eventId) ?? []).filter(t => t.id !== id)
            this.ticketsByEvent.set(eventId, tickets)
        })
    }
}

export const adminStore = new AdminStore()
