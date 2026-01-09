import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AdminDashboardStats } from '../../types/Types';
import { apiDomain } from '../../apiDomain/ApiDomain';


export const AdminApi = createApi({
    reducerPath: 'AdminApi',
    baseQuery: fetchBaseQuery({ baseUrl: apiDomain }),
    tagTypes: ['DashboardData'],
    endpoints: (builder) => ({
        // Fetch admin data
        getAdminDashboardData: builder.query<AdminDashboardStats, void>({
            query: () => 'admin-dashboard',
            providesTags: ['DashboardData'],
        }),
    }),
})                                                                                                                                                                                                                                                                                                        