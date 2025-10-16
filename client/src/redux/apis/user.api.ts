import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IUser } from "../../models/user.interface"
import { RootState } from "../../store"

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`,
        credentials: "include",

        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
        },
    }),
    tagTypes: ["user"],
    endpoints: (builder) => {
        return {
            getUsers: builder.query<{ result: IUser[], totalPages: number }, Partial<{ page: number, limit: number, searchQuery: string, isFetchAll: boolean }>>({
                query: (queryParams = {}) => {
                    return {
                        url: "/get/all/user",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: IUser[], totalPages: number }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["user"]
            }),

            getUserById: builder.query<IUser, string>({
                query: (id) => {
                    return {
                        url: `/get/by/user/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IUser }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["user"]
            }),

            createUser: builder.mutation<{ message: string, result: IUser }, FormData>({
                query: userData => {
                    return {
                        url: "/user/create",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string, result: IUser }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

            updateUser: builder.mutation<string, { userData: FormData, id: string }>({
                query: ({ userData, id }) => {
                    return {
                        url: `/user/update/${id}`,
                        method: "PUT",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

            updateUserStatus: builder.mutation<string, { status: string, id: string }>({
                query: (statusData) => {
                    return {
                        url: `/user/status/${statusData.id}`,
                        method: "PUT",
                        body: statusData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

            deleteUser: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/user/delete/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["user"]
            }),

        }
    }
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useUpdateUserStatusMutation,
    useDeleteUserMutation
} = userApi
