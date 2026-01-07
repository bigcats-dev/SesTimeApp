import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import ENV from '../config/env';

const masterApi = createApi({
  reducerPath: 'masterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ENV.API_URL}/api/master`,
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