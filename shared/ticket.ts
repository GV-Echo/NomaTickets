export interface Ticket {
  id: number
  event_id: number
  event_date: Date
  event_time: string
  price: number
  quantity: number
  created_at: Date
}