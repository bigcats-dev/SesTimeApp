import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import scheduleApi from './schedule';

const leaveApi = createApi({
  reducerPath: 'leaveApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL || 'http://192.168.150.23:10601/api/employees',
    prepareHeaders: (headers, { getState }) => {
      // attach auth token if present in state
      const token = getState().auth?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Leave'],
  endpoints: (builder) => ({
    getLeaves: builder.query({
      query: ({ page = 1, limit = 50 } = {}) =>
        `/leave-history?page=${encodeURIComponent(page)}&per_page=${encodeURIComponent(limit)}`,
      providesTags: (result) =>
        result.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'Leave', id })),
            { type: 'Leave', id: 'LIST' },
          ]
          : [{ type: 'Leave', id: 'LIST' }],
    }),
    getLeave: builder.query({
      query: (id) => `/leaves/${id}`,
      providesTags: (result, error, id) => [{ type: 'Leave', id }],
    }),
    createLeave: builder.mutation({
      query: (body) => ({
        url: '/leave-request',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Leave', id: 'LIST' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(scheduleApi.util.invalidateTags([{ type: 'Schedule', id: 'LIST' }]));
        } catch (err) {
          console.error('Create leave failed:', err);
        }
      },
    }),
    updateLeave: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/leave-request/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Leave', id }],
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `/leave-cancel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Leave', id }
      ],
    }),
  }),
});

export const {
  useGetLeavesQuery,
  useGetLeaveQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leaveApi;

export default leaveApi;