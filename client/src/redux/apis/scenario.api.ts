import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IScenario, IScenarioComparison } from "../../models/scenario.interface"
import { RootState } from "../store"

export const scenarioApi = createApi({
    reducerPath: "scenarioApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/scenarios`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
        },
    }),
    tagTypes: ["scenario"],
    endpoints: (builder) => {
        return {
            createScenario: builder.mutation<{ message: string, result: IScenario }, Partial<IScenario>>({
                query: (scenarioData) => {
                    return {
                        url: "/create/scenario",
                        method: "POST",
                        body: scenarioData
                    }
                },
                transformResponse: (data: { message: string, result: IScenario }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["scenario"]
            }),

            getAllScenarios: builder.query<{ result: IScenario[], totalPages: number }, Partial<{ page: number, limit: number, searchQuery: string }>>({
                query: (queryParams = {}) => {
                    return {
                        url: "/get/scenario",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: IScenario[], totalPages: number }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["scenario"]
            }),

            getScenarioById: builder.query<IScenario, string>({
                query: (id) => {
                    return {
                        url: `/get/by/id/scenario/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IScenario }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["scenario"]
            }),

            updateScenario: builder.mutation<string, { scenarioData: Partial<IScenario>, id: string }>({
                query: ({ scenarioData, id }) => {
                    return {
                        url: `/update/scenario/${id}`,
                        method: "PUT",
                        body: scenarioData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["scenario"]
            }),

            deleteScenario: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/delete/scenario/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["scenario"]
            }),

            compareScenarios: builder.mutation<IScenarioComparison, { scenario1Id: string, scenario2Id: string }>({
                query: (comparisonData) => {
                    return {
                        url: "/compare/scenario",
                        method: "POST",
                        body: comparisonData
                    }
                },
                transformResponse: (data: { result: IScenarioComparison }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["scenario"]
            }),
        }
    }
})

export const {
    useCreateScenarioMutation,
    useGetAllScenariosQuery,
    useGetScenarioByIdQuery,
    useUpdateScenarioMutation,
    useDeleteScenarioMutation,
    useCompareScenariosMutation
} = scenarioApi