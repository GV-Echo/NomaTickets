import { useState } from "react"
import { Modal } from "../ui/Modal"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string, duration: number) => void
}

export const EventFormModal = ({
  isOpen,
  onClose,
  onCreate
}: Props) => {
  const [name, setName] = useState("")
  const [duration, setDuration] = useState(60)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl mb-4">Новое мероприятие</h2>

      <div className="space-y-3">
        <Input
          placeholder="Название"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Input
          type="number"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />

        <Button
          onClick={() => {
            onCreate(name, duration)
            onClose()
          }}
        >
          Создать
        </Button>
      </div>
    </Modal>
  )
}