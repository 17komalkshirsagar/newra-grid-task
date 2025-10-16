import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import {
    IAnalytics,
    IDashboardResponseData,

    IKPITrendsData,
    IComparisonResponseData,
    ISuccessDataResponse,
    ISingleResultResponse,
    IMessageResponse
} from "../../models/analytics.interface";

export const analyticsApi = createApi({
    reducerPath: "analyticsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/analytics`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth?.user?.token;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Analytics"],
    endpoints: (builder) => ({
        createAnalytics: builder.mutation<ISingleResultResponse<IAnalytics>, Partial<IAnalytics>>({
            query: (analyticsData) => ({
                url: "/create/analytics",
                method: "POST",
                body: analyticsData
            }),
            invalidatesTags: ["Analytics"],
        }),
        getDashboardAnalytics: builder.query<IDashboardResponseData, { period?: string }>({
            query: (queryParams) => ({
                url: "/dashboard/analytics",
                method: "GET",
                params: queryParams
            }),
            transformResponse: (response: ISingleResultResponse<IDashboardResponseData>) => response.result,
            providesTags: [{ type: 'Analytics', id: 'DASHBOARD' }],
        }),
        getKPITrends: builder.query<IKPITrendsData[], { months?: number }>({
            query: (queryParams) => ({
                url: "/kpi-trends/analytics",
                method: "GET",
                params: queryParams
            }),
            transformResponse: (response: ISuccessDataResponse<IKPITrendsData[]>) => response.data,
        }),
        getAnalyticsById: builder.query<IAnalytics, string>({
            query: (id) => ({
                url: `/get/analytics/${id}`,
                method: "GET"
            }),
            transformResponse: (response: ISingleResultResponse<IAnalytics>) => response.result,
            providesTags: (_result, _error, id) => [{ type: 'Analytics', id }],


        }),


        updateAnalytics: builder.mutation<ISingleResultResponse<IAnalytics>, { id: string, analyticsData: Partial<IAnalytics> }>({
            query: ({ id, analyticsData }) => ({
                url: `/update/analytics/${id}`,
                method: "PUT",
                body: analyticsData
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Analytics', id }, 'Analytics'],
        }),


        deleteAnalytics: builder.mutation<string, string>({
            query: (id) => ({
                url: `/delete/analytics/${id}`,
                method: "DELETE",
            }),
            transformResponse: (data: IMessageResponse) => data.message,
            invalidatesTags: ["Analytics"],
        }),
        generateUtilityBillAnalytics: builder.mutation<ISuccessDataResponse<IAnalytics>, string>({
            query: (billId) => ({
                url: `/generate/analytics/${billId}`,
                method: "POST",
            }),
            invalidatesTags: ["Analytics"],
        }),
        compareScenarioAnalytics: builder.mutation<IComparisonResponseData, { baselineUtilityBillId: string, scenarioId: string }>({
            query: (compareData) => ({
                url: "/compare/analytics",
                method: "POST",
                body: compareData
            }),
            transformResponse: (response: ISuccessDataResponse<IComparisonResponseData>) => response.data,
        }),
    }),
});

export const {
    useCreateAnalyticsMutation,
    useGetDashboardAnalyticsQuery,
    useGetKPITrendsQuery,
    useGetAnalyticsByIdQuery,
    useUpdateAnalyticsMutation,
    useDeleteAnalyticsMutation,
    useGenerateUtilityBillAnalyticsMutation,
    useCompareScenarioAnalyticsMutation,
} = analyticsApi;
