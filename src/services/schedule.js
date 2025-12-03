import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL || 'http://192.168.1.43:10601/api/employees',
    prepareHeaders: (headers, { getState }) => {
      // attach auth token if present in state
      const token = getState().auth?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Schedule', 'History'],
  endpoints: (builder) => ({
    getSchedule: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        return `/timework?${params.toString()}`;
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
            ...result.map(({ title }) => ({ type: 'Schedule', id: title })),
            { type: 'Schedule', id: 'LIST' },
          ]
          : [{ type: 'Schedule', id: 'LIST' }],
    }),
    getTimeStampHistory: builder.query({
      query: ({ month } = {}) => {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        return `/timestamp-history?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.days && Array.isArray(result?.days)
          ? [
            ...result.days.map(({ date }) => ({ type: 'History', id: date })),
            { type: 'History', id: 'LIST' },
          ]
          : [{ type: 'History', id: 'LIST' }],
    }),
    timestamp: builder.mutation({
      query: (body) => ({
        url: `/timestamp`,
        method: 'POST',
        body,
      }),
    })
  }),
});

export const {
  useGetScheduleQuery,
  useLazyGetScheduleQuery,
  useGetTimeStampHistoryQuery,
  useLazyGetTimeStampHistoryQuery,
  useTimestampMutation,
} = scheduleApi;

export default scheduleApi;