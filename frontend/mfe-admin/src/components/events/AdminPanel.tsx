import {useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {HiOutlinePlus, HiOutlineRefresh} from 'react-icons/hi'
import {adminStore} from '../../stores/adminStore'
import {EventAdminCard} from '../events/EventAdminCard'
import {EventFormModal} from '../modals/EventFormModal'


export const AdminPanel = observer(() => {
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    useEffect(() => {
        adminStore.fetchEvents()
    }, [])

    const total = adminStore.events.length
    const active = adminStore.events.filter(e => e.is_available).length
    const inactive = total - active

    return (
        <div className="space-y-6">
            {/* Заголовок */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Панель управления</h2>
                    <p className="text-gray-500 text-sm mt-0.5">Управление мероприятиями и билетами</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => adminStore.fetchEvents()}
                        disabled={adminStore.loadingEvents}
                        className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Обновить"
                    >
                        <HiOutlineRefresh size={18} className={adminStore.loadingEvents ? 'animate-spin' : ''}/>
                    </button>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                        <HiOutlinePlus size={16}/>
                        Добавить мероприятие
                    </button>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    {label: 'Всего', value: total, color: 'bg-gray-50 border-gray-200'},
                    {label: 'Активных', value: active, color: 'bg-emerald-50 border-emerald-200 text-emerald-700'},
                    {label: 'Скрытых', value: inactive, color: 'bg-amber-50 border-amber-200 text-amber-700'},
                ].map(({label, value, color}) => (
                    <div key={label} className={`border rounded-xl px-4 py-3 ${color}`}>
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="text-sm">{label}</p>
                    </div>
                ))}
            </div>

            {adminStore.errorEvents && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    {adminStore.errorEvents}
                </p>
            )}

            {/* Сетка мероприятий */}
            {adminStore.loadingEvents ? (
                <div className="flex items-center justify-center py-20 text-indigo-500">
                    <svg className="animate-spin h-7 w-7 mr-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Загрузка мероприятий...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {adminStore.events.map(event => (
                        <EventAdminCard key={event.id} event={event}/>
                    ))}
                    {adminStore.events.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            <span className="text-5xl block mb-3">📋</span>
                            <p>Мероприятий ещё нет</p>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="mt-3 text-indigo-600 hover:underline text-sm"
                            >
                                Создать первое
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Модалка создания */}
            <EventFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} event={null}/>
        </div>
    )
})
