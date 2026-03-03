//import { useAuth } from "../../../hooks/useAuth"
import { HiOutlinePhotograph } from "react-icons/hi";
import { useState } from "react"
import { BookingModal } from "../modals/BookingModal"
import { Button } from "../ui/Button"

export const EventCard = ({ event }: any) => {
  //const { user } = useAuth()
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <>
    <div className="p-6 rounded-2xl shadow hover:scale-105 transition min-w-[200px]">
      <div className="w-full h-40 mb-4 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        {event.photo ? (
          <img
            src={event.photo}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <HiOutlinePhotograph size={40} />
            <span className="text-xs mt-1">извините, не успели сфотографировать</span>
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold">{event.name}</h3>
      <p className="text-sm text-gray-500">
        Длительность: {event.duration} мин
      </p>

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
