import {Input} from "../ui/Input"
import {Button} from "../ui/Button"

interface Props {
    quantity: number
    maxAllowed: number
    totalPrice: number
    isUnavailable: boolean
    onQuantityChange: (value: number) => void
    onBuy: () => void
}

export const TicketSummary = ({
                                  quantity,
                                  maxAllowed,
                                  totalPrice,
                                  isUnavailable,
                                  onQuantityChange,
                                  onBuy,
                              }: Props) => {
    return (
        <>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <p><strong>Email:</strong> @mail.com</p>
                <p><strong>Имя:</strong> ...</p>

                <div>
                    <label>Количество билетов</label>
                    <Input
                        type="number"
                        min={1}
                        max={maxAllowed}
                        value={quantity}
                        onChange={(e) =>
                            onQuantityChange(
                                Math.min(Math.max(1, Number(e.target.value)), maxAllowed)
                            )
                        }
                    />
                    <p className="text-sm text-gray-500">Максимум {maxAllowed}</p>
                </div>

                <p className="text-lg font-semibold">Итого: ${totalPrice}</p>
            </div>

            <Button variant="success" onClick={onBuy} disabled={isUnavailable}>
                Купить
            </Button>
        </>
    )
}

