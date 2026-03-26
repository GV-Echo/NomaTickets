import {makeAutoObservable, runInAction} from 'mobx'
import {getTicketsByEvent} from '../services/bookingService'
import type {Ticket} from '../types'

const TTL = 60_000

class TicketStore {
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
        const ts = this.cacheTs.get(eventId) ?? 0
        if (!force && ts && now - ts < TTL && this.ticketsByEvent.has(eventId)) {
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
        } catch (e: unknown) {
            runInAction(() => {
                this.error = 'Ошибка загрузки билетов'
            })
            throw e
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    decrementLocal(ticketId: number, by = 1) {
        for (const tickets of this.ticketsByEvent.values()) {
            const t = tickets.find(tt => tt.id === ticketId)
            if (t) {
                t.quantity = Math.max(0, t.quantity - by);
                break
            }
        }
    }

    incrementLocal(ticketId: number, by = 1) {
        for (const tickets of this.ticketsByEvent.values()) {
            const t = tickets.find(tt => tt.id === ticketId)
            if (t) {
                t.quantity += by;
                break
            }
        }
    }

    invalidate(eventId?: number) {
        if (eventId) {
            this.ticketsByEvent.delete(eventId);
            this.cacheTs.delete(eventId)
        } else {
            this.ticketsByEvent.clear();
            this.cacheTs.clear()
        }
    }
}

export const ticketStore = new TicketStore()
