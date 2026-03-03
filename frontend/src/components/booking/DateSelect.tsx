interface Props {
    dates: Date[]
    selectedDate: string
    onChange: (date: string) => void
}

export const DateSelect = ({dates, selectedDate, onChange}: Props) => {
    return (
        <div>
            <label className="font-medium">Дата</label>
            <select
                value={selectedDate}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 mt-1"
            >
                <option value="">Выберите дату</option>
                {dates.map((date) => (
                    <option key={date.toDateString()} value={date.toDateString()}>
                        {date.toLocaleDateString()}
                    </option>
                ))}
            </select>
        </div>
    )
}

