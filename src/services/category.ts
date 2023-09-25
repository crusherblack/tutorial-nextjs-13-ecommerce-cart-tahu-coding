import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category } from "@prisma/client";
import { APP_URL } from "@/constant";
import { GeneralResponse } from "./type";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: APP_URL }),
  endpoints: (builder) => ({
    getCategories: builder.query<
      GeneralResponse<{
        categories: Category[];
      }>,
      null
    >({
      query: (id) => ({
        url: `/api/dashboard/categories`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
