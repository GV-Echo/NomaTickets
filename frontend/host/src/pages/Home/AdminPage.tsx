import {Suspense, lazy} from 'react'
import {observer} from 'mobx-react-lite'
import {Header} from '../../components/layout/Header'
import {Footer} from '../../components/layout/Footer'
import {useAuth} from '../../hooks/useAuth'

const AdminApp = lazy(() => import('adminApp/AdminApp'))

const Spinner = ({label}: { label: string }) => (
    <div className="flex items-center justify-center py-20 text-indigo-500">
        <svg className="animate-spin h-7 w-7 mr-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        {label}
    </div>
)

export const AdminPage = observer(() => {
    const authValue = useAuth()

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
                <Suspense fallback={<Spinner label="Загрузка панели управления..."/>}>
                    <AdminApp authValue={authValue}/>
                </Suspense>
            </main>
            <Footer/>
        </div>
    )
})
