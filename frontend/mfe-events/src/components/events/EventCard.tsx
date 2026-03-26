import {useState} from 'react'
import {EventImage} from './EventImage'
import {Button} from '../ui/Button'
import {BookingModal} from '../modals/BookingModal'
import type {Event} from '../../types'

interface Props {
    event: Event
}

export const EventCard = ({event}: Props) => {
    const [isBookingOpen, setIsBookingOpen] = useState(false)

    return (
        <>
            <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="p-4 flex-1 flex flex-col">
                    <EventImage photo={event.photo} name={event.name}/>

                    <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                        {event.name}
                    </h3>

                    {event.description && (
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-1">
                            {event.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
              {event.duration} мин
            </span>
                        {!event.is_available && (
                            <span className="text-xs text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                Недоступно
              </span>
                        )}
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => setIsBookingOpen(true)}
                        disabled={!event.is_available}
                    >
                        Забронировать
                    </Button>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                event={event}
            />
        </>
    )
}
