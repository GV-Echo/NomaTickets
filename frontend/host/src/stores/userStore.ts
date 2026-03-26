import {makeAutoObservable, runInAction} from 'mobx'
import * as authService from '../services/authService'
import {invalidateGetMeCache} from '../services/authService'
import type {UserProfile, LoginRequest, RegisterRequest} from '../types/auth.types'

class UserStore {
    user: UserProfile | null = null
    loading = true
    error: string | null = null

    constructor() {
        makeAutoObservable(this)
        this.fetchMe()
    }

    async fetchMe() {
        this.loading = true
        this.error = null
        try {
            const profile = await authService.getMe()
            runInAction(() => {
                this.user = profile
            })
        } catch {
            runInAction(() => {
                this.user = null
            })
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    async login(data: LoginRequest) {
        this.loading = true
        this.error = null
        try {
            await authService.login(data)
            invalidateGetMeCache()
            const profile = await authService.getMe()
            runInAction(() => {
                this.user = profile
            })
        } catch (e: unknown) {
            runInAction(() => {
                const status = (e as { response?: { status?: number } })?.response?.status
                this.error = status === 401
                    ? 'Неверный email или пароль'
                    : 'Ошибка при входе. Попробуйте позже'
            })
            throw e
        } finally {
            runInAction(() => (this.loading = false))
        }
    }

    async register(data: RegisterRequest) {
        this.loading = true
        this.error = null
        try {
            await authService.register(data)
            invalidateGetMeCache()
            const profile = await authService.getMe()
            runInAction(() => {
                this.user = profile
            })
        } catch (e: unknown) {
            runInAction(() => {
                const status = (e as { response?: { status?: number } })?.response?.status
                this.error = status === 409
                    ? 'Пользователь с таким email уже существует'
                    : 'Ошибка при регистрации. Попробуйте позже'
            })
            throw e
        } finally {
            runInAction(() => (this.loading = false))
        }
    }

    async logout() {
        try {
            await authService.logout()
        } finally {
            runInAction(() => {
                this.user = null
            })
        }
    }

    clearError() {
        this.error = null
    }
}

export const userStore = new UserStore()
