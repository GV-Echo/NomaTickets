import type {InputHTMLAttributes} from "react"

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...props}
        />
    )
}