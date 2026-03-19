import {makeAutoObservable, runInAction} from 'mobx'
import {getTicketsByEvent, createTicket, updateTicket, deleteTicket} from '../services/bookingService'
import type {Ticket} from '../../../shared/ticket'

const TICKETS_TTL = 60 * 1000

class TicketStore {
    // map eventId -> tickets
    ticketsByEvent = new Map<number, Ticket[]>()
    loading = false
    error: string | null = null
    private cacheTs = new Map<number, number>()

    constructor() {
        makeAutoObservable(this)
    }

    async fetchTickets(eventId: number, force = false) {
        if (!eventId) return []
        const now = Date.now()
        const ts = this.cacheTs.get(eventId) || 0
        if (!force && ts && now - ts < TICKETS_TTL && this.ticketsByEvent.has(eventId)) {
            return this.ticketsByEvent.get(eventId)!
        }

        this.loading = true
        this.error = null
        try {
            const data = await getTicketsByEvent(eventId)
            runInAction(() => {
                this.ticketsByEvent.set(eventId, data)
                this.cacheTs.set(eventId, Date.now())
            })
            return data
        } catch (e: any) {
            runInAction(() => {
                this.error = e?.message || 'Ошибка загрузки билетов'
            })
            throw e
        } finally {
            runInAction(() => (this.loading = false))
        }
    }

    invalidateCache(eventId?: number) {
        if (eventId) {
            this.ticketsByEvent.delete(eventId)
            this.cacheTs.delete(eventId)
        } else {
            this.ticketsByEvent.clear()
            this.cacheTs.clear()
        }
    }

    invalidateAllCaches() {
        this.invalidateCache()
    }

    decrementTicketQtyLocal(ticketId: number, by = 1) {
        for (const [, tickets] of this.ticketsByEvent) {
            const t = tickets.find(tt => tt.id === ticketId)
            if (t) {
                t.quantity = Math.max(0, t.quantity - by);
                break
            }
        }
    }

    incrementTicketQtyLocal(ticketId: number, by = 1) {
        for (const [, tickets] of this.ticketsByEvent) {
            const t = tickets.find(tt => tt.id === ticketId)
            if (t) {
                t.quantity += by;
                break
            }
        }
    }

    async create(eventId: number, data: any) {
        const created = await createTicket(data)
        this.invalidateCache(eventId)
        await this.fetchTickets(eventId, true)
        return created
    }

    async update(id: number) {
        const updated = await updateTicket(id, {} as any)
        this.invalidateCache()
        return updated
    }

    async remove(id: number) {
        await deleteTicket(id)
        this.invalidateCache()
    }
}

export const ticketStore = new TicketStore()





