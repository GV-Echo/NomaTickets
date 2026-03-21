import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useGetMyBookingsQuery, useCancelBookingMutation } from '../api/bookingApi'
import type { Booking } from '../../../shared/booking'

export const useBookings = () => {
    const { user } = useAuth()
    const { data: bookings = [], isLoading, error, refetch } = useGetMyBookingsQuery(user?.id ?? 0, { skip: !user })
    const [cancelBooking] = useCancelBookingMutation()

    useEffect(() => {
        const handler = () => refetch()
        if (typeof window !== 'undefined') {
            window.addEventListener('bookings:changed', handler)
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('bookings:changed', handler)
            }
        }
    }, [refetch])

    const cancel = async (id: number) => {
        try {
            await cancelBooking(id).unwrap()
            refetch()
            if (typeof window !== 'undefined') window.dispatchEvent(new Event('bookings:changed'))
        } catch (err) {
            console.error('Ошибка при отмене брони', err)
            throw err
        }
    }

    return { bookings: bookings as Booking[], loading: isLoading, error: error ? String(error) : null, cancel, refresh: refetch }
}