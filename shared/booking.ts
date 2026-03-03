export interface Booking {
  id: number
  ticket_id: number
  user_id: number
  is_used: boolean
  cancelled_at: Date | null
  created_at: Date
}