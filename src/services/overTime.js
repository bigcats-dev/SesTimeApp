import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import ENV from '../config/env';
const overTimeApi = createApi({
  reducerPath: 'overTimeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ENV.API_URL}/api/employees`,
    prepareHeaders: (headers, { getState }) => {
      // attach auth token if present in state
      const token = getState().auth?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['OverTime'],
  endpoints: (builder) => ({
    getOverTimes: builder.query({
      query: ({ page = 1, limit = 50 } = {}) =>
        `/overtime?page=${encodeURIComponent(page)}&per_page=${encodeURIComponent(limit)}`,
      providesTags: (result) =>
        result.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'OverTime', id })),
            { type: 'OverTime', id: 'LIST' },
          ]
          : [{ type: 'OverTime', id: 'LIST' }],
    }),
    getOverTime: builder.query({
      query: (id) => `/overtime/${id}`,
      providesTags: (result, error, id) => [{ type: 'OverTime', id }],
    }),
    createOverTime: builder.mutation({
      query: (body) => ({
        url: '/overtime',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'OverTime', id: 'LIST' }],
    }),
    updateOverTime: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/overtime/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'OverTime', id }],
    }),
    deleteOverTime: builder.mutation({
      query: (id) => ({
        url: `/overtime/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'OverTime', id }
      ],
    }),
  }),
});

export const {
  useGetOverTimesQuery,
  useGetOverTimeQuery,
  useCreateOverTimeMutation,
  useUpdateOverTimeMutation,
  useDeleteOverTimeMutation,
} = overTimeApi;

export default overTimeApi;