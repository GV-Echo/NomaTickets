import {useState} from "react"
import {EventList} from "../../components/events/EventList"
import {BookingDrawer} from "../../components/modals/BookingDrawer"
import {useAuth} from "../../hooks/useAuth.tsx"
import {Button} from "../../components/ui/Button.tsx"

export const HomeLayout = () => {
    const {user} = useAuth()
    const [isDrawerOpen, setDrawerOpen] = useState(false)

    const isAdmin = user?.is_admin

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold">
                        Noma Tickets
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isAdmin ? "Режим администратора" : "Бронирование мероприятий"}
                    </p>
                </div>

                {!isAdmin && (
                    <Button
                        variant="primary"
                        onClick={() => setDrawerOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <span>Мои билеты</span>
                    </Button>
                )}
            </div>

            <EventList/>

            {!isAdmin && (
                <BookingDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setDrawerOpen(false)}
                />
            )}
        </div>
    )
}