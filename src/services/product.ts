import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "@prisma/client";
import { APP_URL } from "@/constant";
import { GeneralResponse } from "./type";
import { addSearchParams } from "@/utils/url";

type ProductWithPagination = {
  products: Product[];
  totalCount: number;
  totalPages: number;
};

type ProductPaginationParams = {
  page: number;
  limit: number;
  filter?: {
    name?: string;
  };
};

export type ProductFields = Omit<Product, "image"> & {
  image: File | null | string;
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: APP_URL }),
  endpoints: (builder) => ({
    getProducts: builder.query<
      GeneralResponse<ProductWithPagination>,
      ProductPaginationParams
    >({
      query: ({ page, limit, filter }) => {
        const queryParams = addSearchParams([
          { name: "page", value: page.toString() },
          { name: "limit", value: limit.toString() },
          { name: "name", value: filter?.name },
        ]);

        return `/api/dashboard/products${queryParams}`;
      },
    }),
    addProduct: builder.mutation<GeneralResponse<Product>, ProductFields>({
      query: (product) => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("categoryId", product.categoryId);
        formData.append("price", product.price.toString());
        formData.append("qty", product.qty.toString());

        if (product.image) {
          formData.append("image", product.image);
        }

        return {
          url: "/api/dashboard/products",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),
    updateProduct: builder.mutation<GeneralResponse<Product>, ProductFields>({
      query: ({ id, ...edit }) => {
        const formData = new FormData();
        formData.append("name", edit.name);
        formData.append("description", edit.description);
        formData.append("categoryId", edit.categoryId);
        formData.append("price", edit.price.toString());
        formData.append("qty", edit.qty.toString());

        if (edit.image && typeof edit.image === "object") {
          formData.append("image", edit.image);
        }

        return {
          url: `/api/dashboard/products/${id}`,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/dashboard/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
