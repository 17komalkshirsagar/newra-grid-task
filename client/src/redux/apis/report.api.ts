import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IReport, IReportTemplate } from "../../models/report.interface"
import { RootState } from "../store"

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/reports`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
        },
    }),
    tagTypes: ["report"],
    endpoints: (builder) => {
        return {
            createReport: builder.mutation<{ message: string, result: IReport }, Partial<IReport>>({
                query: (reportData) => {
                    return {
                        url: "/create/report",
                        method: "POST",
                        body: reportData
                    }
                },
                transformResponse: (data: { message: string, result: IReport }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["report"]
            }),

            getAllReports: builder.query<{ result: IReport[], totalPages: number }, Partial<{ page: number, limit: number, searchQuery: string }>>({
                query: (queryParams = {}) => {
                    return {
                        url: "/get/report",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: IReport[], totalPages: number }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["report"]
            }),

            getReportById: builder.query<IReport, string>({
                query: (id) => {
                    return {
                        url: `/get/report/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IReport }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["report"]
            }),

            updateReport: builder.mutation<string, { reportData: Partial<IReport>, id: string }>({
                query: ({ reportData, id }) => {
                    return {
                        url: `/update/report/${id}`,
                        method: "PUT",
                        body: reportData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["report"]
            }),

            deleteReport: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/delete/report/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["report"]
            }),

            generateReport: builder.mutation<{ message: string, filePath: string }, string>({
                query: (id) => {
                    return {
                        url: `/generate/report/${id}`,
                        method: "POST"
                    }
                },
                transformResponse: (data: { message: string, filePath: string }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["report"]
            }),

            downloadReport: builder.query<Blob, string>({
                query: (id) => {
                    return {
                        url: `/report/download/${id}`,
                        method: "GET",
                        responseHandler: (response) => response.blob()
                    }
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["report"]
            }),

            getReportTemplates: builder.query<IReportTemplate[], void>({
                query: () => {
                    return {
                        url: "/templates/report",
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IReportTemplate[] }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                providesTags: ["report"]
            }),
        }
    }
})

export const {
    useCreateReportMutation,
    useGetAllReportsQuery,
    useGetReportByIdQuery,
    useUpdateReportMutation,
    useDeleteReportMutation,
    useGenerateReportMutation,
    useDownloadReportQuery,
    useGetReportTemplatesQuery
} = reportApi