import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL || 'http://192.168.150.23:10601/api',
    prepareHeaders: (headers, { getState }) => {
      // attach auth token if present in state
      const token = getState().auth?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Schedule'],
  endpoints: (builder) => ({
    getSchedule: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        return `/employees/timework?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ title }) => ({ type: 'Schedule', id: title })),
            { type: 'Schedule', id: 'LIST' },
          ]
          : [{ type: 'Schedule', id: 'LIST' }],
    })
  }),
});

export const {
  useGetScheduleQuery,
  useLazyGetScheduleQuery
} = scheduleApi;

export default scheduleApi;