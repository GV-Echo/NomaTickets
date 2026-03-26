import axios from 'axios'
import type {UserProfile, LoginRequest, RegisterRequest} from '../types/auth.types'

export const authApi = axios.create({
    baseURL: '/auth',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true,
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

let _cachedMe: { data: UserProfile; ts: number } | null = null
const ME_TTL = 60_000 // 1 минута

export function invalidateGetMeCache() {
    _cachedMe = null
}

export async function getMe(): Promise<UserProfile> {
    const now = Date.now()
    if (_cachedMe && now - _cachedMe.ts < ME_TTL) return _cachedMe.data
    const response = await authApi.get<UserProfile>('/me')
    _cachedMe = {data: response.data, ts: now}
    return response.data
}
