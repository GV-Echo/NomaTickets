import {useEffect} from 'react'
import {bookingStore} from '../stores/bookingStore'
import {useAuth} from './useAuth'

export const useBookings = () => {
    const {user} = useAuth()

    useEffect(() => {
        if (user) bookingStore.fetchMyBookings(user.id).catch(() => {
        })
    }, [user])

    const cancel = async (id: number) => {
        await bookingStore.cancel(id)
        window.dispatchEvent(new Event('bookings:changed'))
    }

    return {
        bookings: bookingStore.bookings,
        loading: bookingStore.loading,
        error: bookingStore.error,
        cancel,
        refresh: (force = false) =>
            user ? bookingStore.fetchMyBookings(user.id, force) : Promise.resolve([]),
    }
}
