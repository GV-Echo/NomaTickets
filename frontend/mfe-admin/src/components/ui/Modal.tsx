import type {ReactNode} from 'react'

interface Props {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
}

export const Modal = ({isOpen, onClose, children, title}: Props) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                    </div>
                )}
                {!title && (
                    <button onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl z-10">✕</button>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}
