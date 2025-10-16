import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IAnalytics, IDashboardResponseData, IKPITrendsData, ISuccessDataResponse, ISingleResultResponse } from "../../models/analytics.interface"
import { RootState } from "../store"

export const analyticsApi = createApi({
    reducerPath: "analyticsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/analytics`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
        },
    }),
    tagTypes: ["analytics"],
    endpoints: (builder) => {
        return {
            createAnalytics: builder.mutation<ISingleResultResponse<IAnalytics>, Partial<IAnalytics>>({
                query: (analyticsData) => {
                    return {
                        url: "/create/analytics",
                        method: "POST",
                        body: analyticsData
                    }
                },
                transformResponse: (data: ISingleResultResponse<IAnalytics>) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["analytics"]
            }),

            getDashboardAnalytics: builder.query<IDashboardResponseData, { period?: string }>({
                query: (params = {}) => {
                    return {
                        url: "/dashboard/analytics",
                        method: "GET",
                        params
                    }
                },
                transformResponse: (data: ISingleResultResponse<IDashboardResponseData>) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["analytics"]
            }),

            getKPITrends: builder.query<IKPITrendsData[], { months?: number }>({
                query: (params = {}) => {
                    return {
                        url: "/kpi-trends/analytics",
                        method: "GET",
                        params
                    }
                },
                transformResponse: (data: ISuccessDataResponse<IKPITrendsData[]>) => {
                    return data.data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["analytics"]
            }),

            getAnalyticsById: builder.query<IAnalytics, string>({
                query: (id) => {
                    return {
                        url: `/get/analytics/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: ISingleResultResponse<IAnalytics>) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["analytics"]
            }),

            updateAnalytics: builder.mutation<ISingleResultResponse<IAnalytics>, { analyticsData: Partial<IAnalytics>, id: string }>({
                query: ({ analyticsData, id }) => {
                    return {
                        url: `/update/analytics/${id}`,
                        method: "PUT",
                        body: analyticsData
                    }
                },
                transformResponse: (data: ISingleResultResponse<IAnalytics>) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["analytics"]
            }),

            deleteAnalytics: builder.mutation<{ message: string }, string>({
                query: (id) => {
                    return {
                        url: `/delete/analytics/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["analytics"]
            }),

            generateUtilityBillAnalytics: builder.mutation<ISuccessDataResponse<IAnalytics> & { message: string }, string>({
                query: (billId) => {
                    return {
                        url: `/generate/analytics/${billId}`,
                        method: "POST"
                    }
                },
                transformResponse: (data: ISuccessDataResponse<IAnalytics> & { message: string }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["analytics"]
            }),

            compareScenarioAnalytics: builder.mutation<ISuccessDataResponse<any>, { baselineUtilityBillId: string, scenarioId: string }>({
                query: (comparisonData) => {
                    return {
                        url: "/compare/analytics",
                        method: "POST",
                        body: comparisonData
                    }
                },
                transformResponse: (data: ISuccessDataResponse<any>) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["analytics"]
            }),
        }
    }
})

export const {
    useCreateAnalyticsMutation,
    useGetDashboardAnalyticsQuery,
    useGetKPITrendsQuery,
    useGetAnalyticsByIdQuery,
    useUpdateAnalyticsMutation,
    useDeleteAnalyticsMutation,
    useGenerateUtilityBillAnalyticsMutation,
    useCompareScenarioAnalyticsMutation
} = analyticsApi