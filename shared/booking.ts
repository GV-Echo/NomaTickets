export interface Booking {
  id: number
  ticketId: number
  userId: number
  isUsed: boolean
  cancelledAt: string | null
  createdAt: string
}