import type {ReactNode} from "react"

interface Props {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

export const Drawer = ({isOpen, onClose, children}: Props) => {
    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed h-full inset-0 bg-black/30 z-40"
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform flex flex-col z-50 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {children}
            </div>
        </>
    )
}