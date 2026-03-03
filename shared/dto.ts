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
    is_available?: boolean
}


// BOOKING

export interface CreateBookingDto {
    ticket_id: number
    user_id: number
}

export interface UpdateBookingDto {
    is_used?: boolean
    cancelled_at?: Date | null
}


// USER

export interface CreateUserDto {
    name: string
    email: string
    password: string
}

export interface LoginUserDto {
    email: string
    password: string
}


// TICKET

export interface CreateTicketDto {
    event_id: number
    event_date: Date
    event_time: string
    price: number
    quantity: number
}

export interface UpdateTicketDto {
    event_date?: Date
    event_time?: string
    price?: number
    quantity?: number
}