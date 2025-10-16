import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IBill, IBillUploadResponse, IBillData } from "../../models/bill.interface"
import { RootState } from "../store"

export const billApi = createApi({
    reducerPath: "billApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/bills`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.user?.token
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
        },
    }),
    tagTypes: ["bill"],
    endpoints: (builder) => {
        return {
            uploadBill: builder.mutation<IBillUploadResponse, FormData>({
                query: (billData) => {
                    return {
                        url: "/bill/upload",
                        method: "POST",
                        body: billData
                    }
                },
                transformResponse: (data: IBillUploadResponse) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data?: { message: string } }) => {
                    return error.data?.message || "Upload failed"
                },
                invalidatesTags: ["bill"]
            }),

            getBillData: builder.query<IBillData, string>({
                query: (billId) => {
                    return {
                        url: `/get/bill/data/${billId}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IBillData }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data?: { message: string } }) => {
                    return error.data?.message || "Upload failed"
                },
                providesTags: ["bill"]
            }),

            getAllBills: builder.query<{ result: IBill[], totalPages: number }, Partial<{ page: number, limit: number, searchQuery: string }>>({
                query: (queryParams = {}) => {
                    return {
                        url: "/get/all",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: IBill[], totalPages: number }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data?: { message: string } }) => {
                    return error.data?.message || "Upload failed"
                },
                providesTags: ["bill"]
            }),

            getBillById: builder.query<IBill, string>({
                query: (id) => {
                    return {
                        url: `/get/bill/data/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IBill }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data?: { message: string } }) => {
                    return error.data?.message || "Upload failed"
                },
                providesTags: ["bill"]
            }),

            updateBill: builder.mutation<string, { billData: Partial<IBill>, id: string }>({
                query: ({ billData, id }) => {
                    return {
                        url: `/update/bill/${id}`,
                        method: "PUT",
                        body: billData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data?: { message: string } }) => {
                    return error.data?.message || "Upload failed"
                },
                invalidatesTags: ["bill"]
            }),

            deleteBill: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/delete/bill/${id}`,
                        method: "DELETE",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data?: { message: string } }) => {
                    return error.data?.message || "Upload failed"
                },
                invalidatesTags: ["bill"]
            }),

            getBillStatus: builder.query<any, string>({
                query: (billId) => {
                    return {
                        url: `/grt/bill/status/${billId}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: any) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data?: { message: string } }) => {
                    return error.data?.message || "Upload failed"
                },
                providesTags: ["bill"]
            }),

            getBillsAnalytics: builder.query<any, void>({
                query: () => {
                    return {
                        url: "/bill/analytics",
                        method: "GET"
                    }
                },
                transformResponse: (data: any) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data?: { message: string } }) => {
                    return error.data?.message || "Upload failed"
                },
                providesTags: ["bill"]
            }),

            exportForPowerBI: builder.query<any, void>({
                query: () => {
                    return {
                        url: "/export/bill/powerbi",
                        method: "GET"
                    }
                },
                transformResponse: (data: any) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                }
            }),

            exportForERP: builder.query<any, void>({
                query: () => {
                    return {
                        url: "/export/bill/erp",
                        method: "GET"
                    }
                },
                transformResponse: (data: any) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                }
            }),
        }
    }
})

export const {
    useUploadBillMutation,
    useGetBillDataQuery,
    useGetAllBillsQuery,
    useGetBillByIdQuery,
    useUpdateBillMutation,
    useDeleteBillMutation,
    useGetBillStatusQuery,
    useGetBillsAnalyticsQuery,
    useExportForPowerBIQuery,
    useExportForERPQuery
} = billApi