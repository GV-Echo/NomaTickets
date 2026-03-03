//import { useAuth } from "../../../hooks/useAuth"
import {useState} from "react"
import {BookingModal} from "../modals/BookingModal.tsx"
import {Button} from "../ui/Button.tsx"
import {EventImage} from "./EventImage.tsx";

export const EventCard = ({event}: any) => {
    //const { user } = useAuth()
    const [isModalOpen, setModalOpen] = useState(false)

    return (
        <>
            <div className="p-6 rounded-2xl shadow hover:scale-105 transition min-w-50">
                <EventImage photo={event.photo} name={event.name}/>

                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-500">Длительность: {event.duration} мин</p>

                <div className="mt-4 flex gap-2">
                    <Button
                        variant="success"
                        className="mt-4"
                        onClick={() => setModalOpen(true)}
                    >
                        Забронировать
                    </Button>
                    {/* {!user?.isAdmin && (
          <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl">
            Забронировать
          </button>
        )} */}

                    {/* {user?.isAdmin && (
          <>
            <button className="bg-indigo-500 text-white px-3 py-2 rounded-xl">
              Редактировать
            </button>
            <button className="bg-rose-500 text-white px-3 py-2 rounded-xl">
              Удалить
            </button>
          </>
        )} */}
                </div>
            </div>
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                event={event}
            />
        </>
    )
}
