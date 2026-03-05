import {useState, useEffect} from "react"
import {useAuth} from "./useAuth"
import {getMyBookings, cancelBooking, getTicketsByEvent} from "../services/bookingService"
import type {Booking} from "../../../shared/booking"
import type {Ticket} from "../../../shared/ticket"

interface BookingWithTicket extends Booking {
    ticket?: Ticket
}

export const useBookings = () => {
    const {user} = useAuth()
    const [bookings, setBookings] = useState<BookingWithTicket[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadBookings = async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)
            const data = await getMyBookings(user.id)
            
            // Load ticket details for each booking
            const bookingsWithTickets = await Promise.all(
                data.map(async (booking) => {
                    try {
                        // We could cache this or get tickets differently
                        // For now, marking for potential optimization
                        return booking
                    } catch {
                        return booking
                    }
                })
            )
            
            setBookings(bookingsWithTickets)
        } catch (err) {
            setError("Ошибка при загрузке билетов")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadBookings()
    }, [user])

    const cancel = async (id: number) => {
        try {
            setError(null)
            await cancelBooking(id)
            setBookings(bookings.filter(b => b.id !== id))
        } catch (err) {
            setError("Ошибка при отмене брони")
            console.error(err)
        }
    }

    const refresh = async () => {
        await loadBookings()
    }

    return {bookings, loading, error, cancel, refresh}
}