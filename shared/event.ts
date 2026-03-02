export interface Event {
  id: number
  name: string
  description: string | null
  photo: string | null
  duration: number
  isAvailable: boolean
  deletedAt: string | null
  createdAt: string
}