import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IIntegration, IIntegrationTest } from "../../models/integration.interface"
import { RootState } from "../store"

export const integrationApi = createApi({
    reducerPath: "integrationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/integrations`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
        },
    }),
    tagTypes: ["integration"],
    endpoints: (builder) => {
        return {
            createIntegration: builder.mutation<{ message: string, result: IIntegration }, Partial<IIntegration>>({
                query: (integrationData) => {
                    return {
                        url: "/create/integration",
                        method: "POST",
                        body: integrationData
                    }
                },
                transformResponse: (data: { message: string, result: IIntegration }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["integration"]
            }),

            getAllIntegrations: builder.query<{ result: IIntegration[] }, Partial<{ type: string, status: string }>>({
                query: (queryParams = {}) => {
                    return {
                        url: "/get/all/integrations",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: IIntegration[] }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["integration"]
            }),

            getIntegrationById: builder.query<IIntegration, string>({
                query: (id) => {
                    return {
                        url: `/get/integration/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IIntegration }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["integration"]
            }),

            updateIntegration: builder.mutation<string, { integrationData: Partial<IIntegration>, id: string }>({
                query: ({ integrationData, id }) => {
                    return {
                        url: `/update/integration/${id}`,
                        method: "PUT",
                        body: integrationData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["integration"]
            }),

            deleteIntegration: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/delete/integration/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["integration"]
            }),

            testIntegration: builder.mutation<IIntegrationTest, string>({
                query: (id) => {
                    return {
                        url: `/test/integration/${id}`,
                        method: "POST"
                    }
                },
                transformResponse: (data: { result: IIntegrationTest }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["integration"]
            }),

            syncIntegration: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/sync/integration/${id}`,
                        method: "POST"
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["integration"]
            }),
        }
    }
})

export const {
    useCreateIntegrationMutation,
    useGetAllIntegrationsQuery,
    useGetIntegrationByIdQuery,
    useUpdateIntegrationMutation,
    useDeleteIntegrationMutation,
    useTestIntegrationMutation,
    useSyncIntegrationMutation
} = integrationApi