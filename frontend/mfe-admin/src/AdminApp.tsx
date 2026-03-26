import {AdminPanel} from './components/events/AdminPanel'
import {AuthContext, type AuthContextValue} from './providers/AuthProvider'
import './index.css'

interface Props {
    authValue?: AuthContextValue
}

/**
 * AdminApp — корневой компонент MFE-2.
 * Паттерн тот же что у EventsApp: shell-agnostic через props.
 */
const AdminApp = ({authValue}: Props) => {
    const content = (
        <div className="admin-mfe">
            <AdminPanel/>
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

export default AdminApp
