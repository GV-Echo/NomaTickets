import { useNavigate } from 'react-router-dom'
import { useGetMeQuery, useLoginMutation, useRegisterMutation, useLogoutMutation } from '../api/authApi'
import { type LoginRequest, type RegisterRequest } from '../types/auth.types'

export const useAuth = () => {
    const navigate = useNavigate()
    const { data: user, isLoading, refetch } = useGetMeQuery(undefined, { refetchOnMountOrArgChange: true })
    const [loginMutation, { isLoading: loginLoading }] = useLoginMutation()
    const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation()
    const [logoutMutation] = useLogoutMutation()

    const login = async (data: LoginRequest) => {
        await loginMutation(data).unwrap()
        await refetch()
        navigate('/home')
    }

    const register = async (data: RegisterRequest) => {
        await registerMutation(data).unwrap()
        await refetch()
        navigate('/home')
    }

    const logout = async () => {
        try {
            await logoutMutation().unwrap()
        } finally {
            await refetch()
            navigate('/login')
        }
    }

    return {
        user: user ?? null,
        loading: isLoading,
        login,
        register,
        logout,
        refetch,
        loginLoading,
        registerLoading,
    }
}