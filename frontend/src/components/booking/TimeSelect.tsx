import type {Ticket} from "../../../../shared"

interface Props {
    times: Ticket[]
    selectedTicketId: number | null
    onChange: (ticketId: number) => void
}

export const TimeSelect = ({times, selectedTicketId, onChange}: Props) => {
    return (
        <div>
            <label className="font-medium">Время</label>
            <select
                value={selectedTicketId ?? ""}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full border rounded-xl px-3 py-2 mt-1"
            >
                <option value="">Выберите время</option>
                {times.map((ticket) => (
                    <option key={ticket.id} value={ticket.id}>
                        {ticket.event_time} (осталось {ticket.quantity})
                    </option>
                ))}
            </select>
        </div>
    )
}


