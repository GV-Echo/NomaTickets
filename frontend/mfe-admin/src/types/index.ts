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

export interface CreateTicketDto {
    event_id: number
    event_date: string
    event_time: string
    price: number
    quantity: number
}

export interface UpdateTicketDto {
    event_date?: string
    event_time?: string
    price?: number
    quantity?: number
}
