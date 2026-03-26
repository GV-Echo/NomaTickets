interface Props {
    message: string | null
}

export const AuthError = ({message}: Props) => {
    if (!message) return null
    return (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3">
            {message}
        </div>
    )
}
