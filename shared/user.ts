export interface User {
  id: number
  name: string
  email: string
  password_hash?: string
  is_admin: boolean
  created_at: Date
}