import {useEffect} from "react"
import {useAuth} from "./useAuth"
import {bookingStore} from "../stores/bookingStore"

export const useBookings = () => {
    const {user} = useAuth()

    useEffect(() => {
        if (user) bookingStore.fetchMyBookings(user.id).catch(() => {
        })
    }, [user])

    const bookings = bookingStore.bookings
    const loading = bookingStore.loading
    const error = bookingStore.error

    const cancel = async (id: number) => {
        await bookingStore.cancel(id)
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("bookings:changed"))
        }
    }

    return {
        bookings,
        loading,
        error,
        cancel,
        refresh: (force = false) => user ? bookingStore.fetchMyBookings(user.id, force) : Promise.resolve([])
    }
}