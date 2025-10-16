import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  inquiryType: 'sales' | 'support' | 'partnership' | 'general';
  message: string;
}

export interface ContactMessage extends ContactFormData {
  _id: string;
  status?: 'new' | 'read' | 'responded' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
}

export interface GetContactMessagesResponse {
  success: boolean;
  data: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/contact`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    submitContact: builder.mutation<ContactResponse, ContactFormData>({
      query: (contactData) => ({
        url: '/submit',
        method: 'POST',
        body: contactData,
      }),
      invalidatesTags: ['Contact'],
    }),
    getContactMessages: builder.query<GetContactMessagesResponse, Partial<{ page: number; limit: number; searchQuery: string; status: string; inquiryType: string }>>({
      query: (queryParams = {}) => ({
        url: '',
        method: 'GET',
        params: queryParams,
      }),
      providesTags: ['Contact'],
    }),
    updateContactStatus: builder.mutation<ContactResponse, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Contact'],
    }),
    deleteContact: builder.mutation<ContactResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useSubmitContactMutation,
  useGetContactMessagesQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation
} = contactApi;