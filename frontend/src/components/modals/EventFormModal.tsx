import {useEffect, useState} from "react"
import {Modal} from "../ui/Modal"
import {Input} from "../ui/Input"
import {Button} from "../ui/Button"

interface EventFormData {
    name: string
    description?: string
    photo?: string
    duration: number
}

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: EventFormData) => void
    initialData?: Partial<EventFormData>
}

export const EventFormModal = ({
                                   isOpen,
                                   onClose,
                                   onSubmit,
                                   initialData
                               }: Props) => {
    const [name, setName] = useState(initialData?.name ?? "")
    const [description, setDescription] = useState(initialData?.description ?? "")
    const [photo, setPhoto] = useState(initialData?.photo ?? "")
    const [duration, setDuration] = useState(initialData?.duration ?? 60)

    useEffect(() => {
        if (!isOpen) return
        setName(initialData?.name ?? "")
        setDescription(initialData?.description ?? "")
        setPhoto(initialData?.photo ?? "")
        setDuration(initialData?.duration ?? 60)
    }, [isOpen, initialData])

    const handleSubmit = () => {
        onSubmit({
            name: name.trim(),
            description: description.trim() || undefined,
            photo: photo.trim() || undefined,
            duration,
        })
        onClose()
    }

    const title = initialData ? "Редактирование мероприятия" : "Новое мероприятие"
    const buttonLabel = initialData ? "Сохранить" : "Создать"

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl mb-4 font-semibold">{title}</h2>

            <div className="space-y-3">
                <Input
                    placeholder="Название"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <Input
                    placeholder="Описание"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <Input
                    placeholder="Ссылка на обложку"
                    value={photo}
                    onChange={e => setPhoto(e.target.value)}
                />
                <Input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                />

                <Button onClick={handleSubmit}>
                    {buttonLabel}
                </Button>
            </div>
        </Modal>
    )
}