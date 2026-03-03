interface Props {
    text: string
}

export const Badge = ({text}: Props) => {
    return (
        <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-lg text-sm">
      {text}
    </span>
    )
}