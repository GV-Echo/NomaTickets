import {makeAutoObservable, runInAction} from 'mobx'
import {getAllEvents} from '../services/bookingService'
import type {Event} from '../types'

const TTL = 60_000

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
        if (!force && this.cacheTs && now - this.cacheTs < TTL) return this.events
        this.loading = true
        this.error = null
        try {
            const data = await getAllEvents()
            runInAction(() => {
                this.events = data;
                this.cacheTs = Date.now()
            })
            return data
        } catch (e: unknown) {
            runInAction(() => {
                this.error = 'Не удалось загрузить мероприятия'
            })
            throw e
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    invalidate() {
        this.cacheTs = null
    }
}

export const eventStore = new EventStore()
