import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiDomain } from '../../apiDomain/ApiDomain'
import type { Order, OrderFormValues } from '../../types/Types'


export const OrderItemsApi = createApi({
    reducerPath: 'orderItemsApi',
    baseQuery: fetchBaseQuery({ baseUrl: apiDomain}),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        //getAllOrders
        getAllOrders: builder.query<Order[], void>({
            query: () => '/orders'
        }),
        //get by id
        //get latest orders
        //create new
        //update order status
        //delete order

       //fetch all order for one customer using customer id
        // getAllOrderByCustomerId: builder.query<Omit<AllOrderData[], 'customer_email' | 'customer_name'>, { customer_id: number }>({
        //     query: ({ customer_id }) => `orders/customer/${customer_id}`,
        //     providesTags: ['Orders']
        // }),

        //get order by id
        getOrderById: builder.query<Order, { id: number }>({
            query: ({ id }) => `orders/${id}`,
            providesTags: ['Orders'],
        }),

        //add new order
        addNewOrder: builder.mutation<{ message: string }, OrderFormValues>({
            query: (newOrder) => ({
                url: 'orders',
                method: 'POST',
                body: newOrder,
            }),
            invalidatesTags: ['Orders'],
        }),

        //update order status
        updateOrderStatus: builder.mutation<{ message: string }, { id: number, status:string }>({
            query: ({ id, ...updateOrder }) => ({
                url: `orders/${id}`,
                method: 'PATCH',
                body: updateOrder,
            }),
            invalidatesTags: ['Orders'],
        }),
        
        //delete order
        deleteOrder: builder.mutation<{ message: string }, { id: number }>({
            query: ({ id }) => ({
                url: `orders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Orders'],
        }),


    })
})