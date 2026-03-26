import type {ReactNode} from 'react'

interface Props {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

export const Modal = ({isOpen, onClose, children}: Props) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    )
}
