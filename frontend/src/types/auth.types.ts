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