import {makeAutoObservable, runInAction} from 'mobx'
import {getMyBookings, createBooking, cancelBooking} from '../services/bookingService'
import {ticketStore} from './ticketStore'
import type {Booking} from '../../../shared/booking'

const BOOKINGS_TTL = 60 * 1000

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
        if (!force && this.cacheTs && now - this.cacheTs < BOOKINGS_TTL) return this.bookings

        this.loading = true
        this.error = null
        try {
            const data = await getMyBookings(userId)
            runInAction(() => {
                this.bookings = data
                this.cacheTs = Date.now()
            })
            return data
        } catch (e: any) {
            runInAction(() => {
                this.error = e?.message || 'Ошибка загрузки бронирований'
            })
            throw e
        } finally {
            runInAction(() => (this.loading = false))
        }
    }

    invalidateCache() {
        this.cacheTs = null
    }

    async create(ticketId: number, userId: number) {
        this.error = null
        // optimistic local
        const temp: Booking = {
            id: -Date.now(),
            ticket_id: ticketId,
            user_id: userId,
            is_used: false,
            created_at: new Date(),
            cancelled_at: null,
        } as unknown as Booking

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
                this.error = (e as any)?.response?.data?.message || 'Ошибка при покупке билета'
            })
            ticketStore.incrementTicketQtyLocal(ticketId, 1)
            throw e
        }
    }

    async cancel(bookingId: number) {
        const idx = this.bookings.findIndex(b => b.id === bookingId)
        if (idx === -1) return

        const original = this.bookings[idx]
        runInAction(() => {
            this.bookings[idx] = {...original, cancelled_at: new Date()}
        })

        try {
            const res = await cancelBooking(bookingId)
            // синхронизировать ticketStore
            ticketStore.incrementTicketQtyLocal(original.ticket_id, 1)
            this.cacheTs = Date.now()
            return res
        } catch (e) {
            runInAction(() => {
                this.bookings[idx] = original
                this.error = (e as any)?.message || 'Ошибка при отмене брони'
            })
            throw e
        }
    }
}

export const bookingStore = new BookingStore()




