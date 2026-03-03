import { useState } from "react"

export const useBookings = () => {
  const [bookings, setBookings] = useState<any[]>([])

  const book = (event: any) => {
    setBookings([...bookings, { id: Date.now(), event }])
  }

  const cancel = (id: number) => {
    setBookings(bookings.filter(b => b.id !== id))
  }

  return { bookings, book, cancel }
}