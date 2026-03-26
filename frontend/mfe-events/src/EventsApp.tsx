import {EventList} from './components/events/EventList'
import {AuthContext, type AuthContextValue} from './providers/AuthProvider'
import './index.css'

interface Props {
    authValue?: AuthContextValue
}

const EventsApp = ({authValue}: Props) => {
    const content = (
        <div className="events-mfe">
            <EventList/>
        </div>
    )

    if (authValue) {
        return (
            <AuthContext.Provider value={authValue}>
                {content}
            </AuthContext.Provider>
        )
    }

    return content
}

export default EventsApp
