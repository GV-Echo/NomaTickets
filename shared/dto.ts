// EVENT

export interface CreateEventDto {
  name: string
  description?: string
  photo?: string
  duration: number
}

export interface UpdateEventDto {
  name?: string
  description?: string
  photo?: string
  duration?: number
  isAvailable?: boolean
}


// BOOKING

export interface CreateBookingDto {
  ticketId: number
}