import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

import { supabase } from "@/lib/supabase";
import { PRODUCT_IMAGE_PATH } from "@/constant";
import { Product } from "@prisma/client";
import { UpdateProductDto } from "../dto";
import { getToken } from "next-auth/jwt";
import slugify from "slugify";

const { json: jsonResponse } = NextResponse;

export const PATCH = async (request: NextRequest, { params: { id } }: any) => {
  try {
    const formData = await request.formData();

    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const response = UpdateProductDto.safeParse(formData);

    if (!response.success) {
      const { errors } = response.error;

      return jsonResponse(
        {
          message: "Invalid request",
          errors,
        },
        {
          status: 400,
        }
      );
    }

    const existedProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existedProduct) {
      return jsonResponse(
        {
          message: "Product Not Found",
        },
        {
          status: 404,
        }
      );
    }

    const { name, description, categoryId, price, qty } = response.data;

    let data: Partial<Product> = {
      name,
      description,
      categoryId,
      price,
      qty,
    };

    const image = formData.get("image") as File;

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (image && image.size > maxSizeInBytes) {
      return jsonResponse(
        {
          message: "Invalid request",
          errors: [{ message: "max image is 5MB" }],
        },
        {
          status: 400,
        }
      );
    }

    if (image) {
      //delete image if already exist
      if (existedProduct?.image) {
        supabase.storage
          .from("storage")
          .remove(["products/" + existedProduct?.image]);
      }

      //replace it with new one
      const fileExtension = `.${image.name.split(".").pop()}` || "";

      const { data: uploadData, error } = await supabase.storage
        .from("storage/products")
        .upload(
          `product-${slugify(name, { lower: true })}-${Date.now()}-${
            session?.id
          }` + fileExtension,
          image
        );

      if (uploadData?.path) {
        data.image = uploadData.path;
      }

      if (error) {
        return jsonResponse(
          {
            message: "Failed to upload image",
            errors: [error],
          },
          {
            status: 400,
          }
        );
      }
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data,
    });

    return jsonResponse(
      {
        message: "Successfully updated product",
        data: {
          product: {
            ...product,
            image: PRODUCT_IMAGE_PATH + product.image,
          },
        },
      },
      {
        status: 200,
      }
    );
  } catch (_error) {
    return jsonResponse(
      {
        message: "Server Error",
      },
      {
        status: 500, //server error status code
      }
    );
  }
};

export const DELETE = async (
  _request: NextRequest,
  { params: { id } }: any
) => {
  try {
    const existedProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existedProduct) {
      return jsonResponse(
        {
          message: "Product Not Found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return jsonResponse(
      {
        message: "Successfully delete product",
        data: {},
      },
      {
        status: 200,
      }
    );
  } catch (_error) {
    return jsonResponse(
      {
        message: "Server Error",
      },
      {
        status: 500, //server error status code
      }
    );
  }
};
