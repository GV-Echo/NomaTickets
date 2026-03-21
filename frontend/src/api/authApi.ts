import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { UserProfile, LoginRequest, RegisterRequest } from '../types/auth.types'

const baseUrl = import.meta.env.VITE_AUTH_API_URL as string

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refresh = await baseQuery({ url: '/refresh', method: 'POST' }, api, extraOptions)
    if (!refresh.error) {
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['User'],
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getMe: build.query<UserProfile, void>({
      query: () => ({ url: '/me' }),
      providesTags: [{ type: 'User', id: 'ME' }],
      keepUnusedDataFor: 60,
    }),
    login: build.mutation<void, LoginRequest>({
      query: (body) => ({ url: '/login', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    register: build.mutation<void, RegisterRequest>({
      query: (body) => ({ url: '/register', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: '/logout', method: 'POST' }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi
