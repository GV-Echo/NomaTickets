import axios from 'axios'
import type {AuthTokenResponse, LoginRequest, RegisterRequest, UserProfile} from '../types/auth.types.ts'

const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URL as string,
    headers: {'Content-Type': 'application/json'},
})

export async function register(data: RegisterRequest): Promise<AuthTokenResponse> {
    const response = await authApi.post<AuthTokenResponse>('/register', data)
    return response.data
}

export async function login(data: LoginRequest): Promise<AuthTokenResponse> {
    const response = await authApi.post<AuthTokenResponse>('/login', data)
    return response.data
}

export async function getMe(token: string): Promise<UserProfile> {
    const response = await authApi.get<UserProfile>('/me', {
        headers: {Authorization: `Bearer ${token}`},
    })
    return response.data
}
