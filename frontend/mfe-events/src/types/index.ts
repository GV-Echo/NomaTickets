export interface UserProfile {
  id: number
  name: string
  email: string
  is_admin: boolean
  created_at: string
}

export interface Event {
  id: number
  name: string
  description: string | null
  photo: string | null
  duration: number
  is_available: boolean
  deleted_at: string | null
  created_at: string
}

export interface Ticket {
  id: number
  event_id: number
  event_date: string
  event_time: string
  price: number
  quantity: number
  created_at: string
}

export interface Booking {
  id: number
  ticket_id: number
  user_id: number
  is_used: boolean
  cancelled_at: string | null
  created_at: string
}
