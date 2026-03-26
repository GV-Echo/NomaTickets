import {makeAutoObservable, runInAction} from 'mobx'
import {getMyBookings, createBooking, cancelBooking} from '../services/bookingService'
import {ticketStore} from './ticketStore'
import type {Booking} from '../types'

const TTL = 60_000

class BookingStore {
    bookings: Booking[] = []
    loading = false
    error: string | null = null
    private cacheTs: number | null = null

    constructor() {
        makeAutoObservable(this)
    }

    async fetchMyBookings(userId: number, force = false) {
        if (!userId) return []
        const now = Date.now()
        if (!force && this.cacheTs && now - this.cacheTs < TTL) return this.bookings
        this.loading = true
        this.error = null
        try {
            const data = await getMyBookings(userId)
            runInAction(() => {
                this.bookings = data;
                this.cacheTs = Date.now()
            })
            return data
        } catch (e: unknown) {
            runInAction(() => {
                this.error = 'Ошибка загрузки бронирований'
            })
            throw e
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    async create(ticketId: number, userId: number) {
        const temp: Booking = {
            id: -Date.now(), ticket_id: ticketId, user_id: userId,
            is_used: false, cancelled_at: null, created_at: new Date().toISOString(),
        }
        runInAction(() => {
            this.bookings.unshift(temp)
        })
        try {
            const created = await createBooking(ticketId, userId)
            runInAction(() => {
                const idx = this.bookings.findIndex(b => b.id === temp.id)
                if (idx >= 0) this.bookings[idx] = created
                this.cacheTs = Date.now()
            })
            return created
        } catch (e) {
            runInAction(() => {
                this.bookings = this.bookings.filter(b => b.id !== temp.id)
            })
            ticketStore.incrementLocal(ticketId, 1)
            throw e
        }
    }

    async cancel(bookingId: number) {
        const idx = this.bookings.findIndex(b => b.id === bookingId)
        if (idx === -1) return
        const original = this.bookings[idx]
        runInAction(() => {
            this.bookings[idx] = {...original, cancelled_at: new Date().toISOString()}
        })
        try {
            const res = await cancelBooking(bookingId)
            ticketStore.incrementLocal(original.ticket_id, 1)
            this.cacheTs = Date.now()
            return res
        } catch (e) {
            runInAction(() => {
                this.bookings[idx] = original
            })
            throw e
        }
    }

    invalidate() {
        this.cacheTs = null
    }
}

export const bookingStore = new BookingStore()
