import type { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "danger" | "ghost"
}

export const Button = ({
  children,
  variant = "primary",
  ...props
}: Props) => {
  const base =
    "px-4 py-2 rounded-xl font-medium transition active:scale-95"

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    ghost: "bg-gray-100 hover:bg-gray-200"
  }

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  )
}