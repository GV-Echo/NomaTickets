export interface LoginFormState {
    email: string
    password: string
}

export interface RegisterFormState {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthTokenResponse {
    access_token: string
}

export interface UserProfile {
    id: number
    name: string
    email: string
    is_admin: boolean
    created_at: string
}

export interface AuthContextValue {
    user: UserProfile | null
    loading: boolean
    error: string | null
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
    clearError: () => void
}