import axios from 'axios'
import type {UserProfile, LoginRequest, RegisterRequest} from '../types/auth.types'

const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URL as string,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true, // отправлять HttpOnly cookie с каждым запросом
})

export async function register(data: RegisterRequest): Promise<void> {
    await authApi.post('/register', data)
}

export async function login(data: LoginRequest): Promise<void> {
    await authApi.post('/login', data)
}

export async function refresh(): Promise<void> {
    await authApi.post('/refresh')
}

export async function logout(): Promise<void> {
    await authApi.post('/logout')
}

export async function getMe(): Promise<UserProfile> {
    const response = await authApi.get<UserProfile>('/me')
    return response.data
}

export {authApi}
