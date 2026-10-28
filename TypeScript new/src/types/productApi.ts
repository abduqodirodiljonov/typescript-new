import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from './product';

export const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzkxNTU1OTk1LCJpYXQiOjE3OTE1NTUwOTUsImp0aSI6IjAzNTcyZjliYmJmMTQ1NzA5MzFlOWYwY2ZlMTJiN2YyIiwidXNlcl9pZCI6IjUyNiJ9.13I0RKb1qsqAVlmmClw7xYFBjeAGXEBPG1iY3t5RNHg';

export interface CreateProductDto {
  name: string;
  description: string;
  price: string;
}

export interface UpdateProductDto {
  name: string;
  description: string;
  price: string;
}

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      const token = TOKEN;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({

    getProducts: builder.query<Product[], void>({
      query: () => 'products/',
      providesTags: ['Products'],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}/`,
      providesTags: ['Products'],
    }),

    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (newProduct) => ({
        url: 'products/create/',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<Product, { id: number; patch: UpdateProductDto }>({
      query: ({ id, patch }) => ({
        url: `products/${id}/update/`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Products'],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}/delete/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

