import {makeAutoObservable, runInAction} from 'mobx'
import {getAllEvents, createEvent, updateEvent, deleteEvent} from '../services/bookingService'
import type {Event} from '../../../shared'

const EVENTS_TTL = 60 * 1000

class EventStore {
    events: Event[] = []
    loading = false
    error: string | null = null

    private cacheTs: number | null = null

    constructor() {
        makeAutoObservable(this)
    }

    async fetchEvents(force = false) {
        const now = Date.now()
        if (!force && this.cacheTs && now - this.cacheTs < EVENTS_TTL) return this.events

        this.loading = true
        this.error = null
        try {
            const data = await getAllEvents()
            runInAction(() => {
                this.events = data
                this.cacheTs = Date.now()
            })
            return data
        } catch (e: any) {
            runInAction(() => {
                this.error = e?.message || 'Ошибка загрузки мероприятий'
            })
            throw e
        } finally {
            runInAction(() => (this.loading = false))
        }
    }

    invalidateCache() {
        this.cacheTs = null
    }

    async create(data: Partial<Event>) {
        const created = await createEvent(data as any)
        this.invalidateCache()
        await this.fetchEvents(true)
        return created
    }

    async update(id: number, data: Partial<Event>) {
        const updated = await updateEvent(id, data as any)
        this.invalidateCache()
        await this.fetchEvents(true)
        return updated
    }

    async remove(id: number) {
        await deleteEvent(id)
        this.invalidateCache()
        await this.fetchEvents(true)
    }
}

export const eventStore = new EventStore()



