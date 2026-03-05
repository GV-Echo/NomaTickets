import {EventList} from "../../components/events/EventList"
import {useState} from "react"
import {BookingDrawer} from "../../components/modals/BookingDrawer"


export const HomeLayout = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false)
    

    return (
        <div className="p-8 space-y-6">
            <button
                onClick={() => setDrawerOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
            >
                Мои билеты
            </button>

            {/* {!user?.isAdmin && (
        
      )} */}

            {/* {user?.isAdmin && <AdminPanel />} */}

            <EventList/>

            <BookingDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    )
}