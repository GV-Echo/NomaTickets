import {useState, useEffect, useCallback} from "react"
import {useAuth} from "./useAuth"
import {getMyBookings, cancelBooking} from "../services/bookingService"
import type {Booking} from "../../../shared/booking"

export const useBookings = () => {
    const {user} = useAuth()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadBookings = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)
            const data = await getMyBookings(user.id)
            setBookings(data)
        } catch (err) {
            setError("Ошибка при загрузке билетов")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        loadBookings()
    }, [loadBookings])

    const cancel = async (id: number) => {
        try {
            setError(null)
            await cancelBooking(id)
            await loadBookings()
        } catch (err) {
            setError("Ошибка при отмене брони")
            console.error(err)
        }
    }

    return {bookings, loading, error, cancel, refresh: loadBookings}
}