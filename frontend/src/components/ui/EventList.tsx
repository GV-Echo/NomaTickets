import { EventCard } from "./EventCard"

export const EventList = () => {
  const mockEvents = [
    { id: 1, name: "Concert", duration: 120 },
    { id: 2, name: "Theatre", duration: 90 },
    { id: 3, name: "Concert", duration: 120 },
    { id: 4, name: "Theatre", duration: 90 },
    { id: 5, name: "Concert", duration: 120 },
    { id: 6, name: "Theatre", duration: 90 },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-10">
      {mockEvents.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </div>
  )
}