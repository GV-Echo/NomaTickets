import {useState} from "react"
import type {Ticket} from "../../../shared"

export const useTickets = () => {
    const [tickets] = useState<Ticket[]>([
        {
            id: 1,
            event_id: 1,
            event_date: new Date("2026-04-01"),
            event_time: "18:00",
            price: 50,
            quantity: 20,
            created_at: new Date("2026-04-01")
        },
        {
            id: 2,
            event_id: 1,
            event_date: new Date("2026-04-01"),
            event_time: "21:00",
            price: 50,
            quantity: 5,
            created_at: new Date("2026-04-01")
        },
        {
            id: 3,
            event_id: 1,
            event_date: new Date("2026-04-02"),
            event_time: "19:00",
            price: 60,
            quantity: 12,
            created_at: new Date("2026-04-02")
        }
    ])

    const getDates = (eventId: number) => {
        return [...new Set(tickets.filter(t => t.event_id === eventId).map(t => t.event_date))]
    }

    const getTimesByDate = (eventId: number, date: string) => {
        return tickets.filter(t => t.event_id === eventId && t.event_date.toDateString() === new Date(date).toDateString())
    }

    return {tickets, getDates, getTimesByDate}
}