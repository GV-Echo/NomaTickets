export interface Event {
  id: number
  name: string
  description: string | null
  photo: string | null
  duration: number
  is_available: boolean
  deleted_at: Date | null
  created_at: Date
}