import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const masterApi = createApi({
  reducerPath: 'masterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_BASE_URL || 'http://192.168.1.43:10601/api/master',
  }),
  tagTypes: ['MasterTip', 'MasterLeave'],
  endpoints: (builder) => ({
    getTips: builder.query({
      query: () => '/tips',
      providesTags: (result) =>
        result
          ? [
            ...result?.data?.map(({ id }) => ({ type: 'MasterTip', id })),
            { type: 'MasterTip', id: 'LIST' },
          ]
          : [{ type: 'MasterTip', id: 'LIST' }],
    }),
    getLeaveType: builder.query({
      query: () => '/leave-statuses',
      providesTags: (result) =>
        result
          ? [
            ...result?.data?.map(({ id }) => ({ type: 'MasterLeave', id })),
            { type: 'MasterLeave', id: 'LIST' },
          ]
          : [{ type: 'MasterLeave', id: 'LIST' }],
    })
  }),
});

export const {
  useGetTipsQuery,
  useGetLeaveTypeQuery,
} = masterApi;

export default masterApi;