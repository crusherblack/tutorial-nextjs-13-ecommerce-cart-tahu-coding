import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";

import { supabase } from "@/lib/supabase";
import { CreateProductDto } from "./dto";
import { PRODUCT_IMAGE_PATH } from "@/constant";
import { getToken } from "next-auth/jwt";

const { json: jsonResponse } = NextResponse;

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);

  // Current page (default: 1)
  const page = parseInt(url.searchParams.get("page") as string) || 1;

  // Number of items per page (default: 10)
  const limit = parseInt(url.searchParams.get("limit") as string) || 10;

  const name = url.searchParams.get("name") || "";

  try {
    //add filter by name if existed
    let where = {};

    if (name) {
      where = {
        name: {
          contains: name.trim().toLowerCase(),
          mode: "insensitive",
        },
      };
    }

    // Get total count of todos
    const totalCount = await prisma.product.count({
      where,
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    const products = await prisma.product.findMany({
      skip: (page - 1) * limit, // Calculate the number of items to skip based on the current page and limit
      take: limit, // Set the number of items to retrieve per page
      include: {
        category: true,
      },
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return jsonResponse(
      {
        message: "Successfully get products",
        data: {
          products: products.map((product) => ({
            ...product,
            image: PRODUCT_IMAGE_PATH + product.image,
          })),
          totalCount,
          totalPages,
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

export const POST = async (request: NextRequest) => {
  try {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const formData = await request.formData();

    const response = CreateProductDto.safeParse(formData);

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

    const { name, description, categoryId, price, qty, image } = response.data;
    const fileExtension = `.${image.name.split(".").pop()}` || "";

    //upload image to server
    const { data: uploadData, error } = await supabase.storage
      .from("storage/products")
      .upload(
        `product-${slugify(name, { lower: true })}-${Date.now()}-${
          session?.id
        }` + fileExtension,
        image
      );
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
    } else {
      let slug = slugify(name, { lower: true });

      const existingRecord = await prisma.product.findUnique({
        where: { slug },
      });

      // Check if the slug already exists
      if (existingRecord) {
        // Generate a unique slug by appending a counter
        let counter = 1;
        let uniqueSlug = `${slug}-${counter}`;

        // Keep incrementing the counter until a unique slug is found
        while (
          await prisma.product.findUnique({ where: { slug: uniqueSlug } })
        ) {
          counter++;
          uniqueSlug = `${slug}-${counter}`;
        }

        // Set the unique slug
        slug = uniqueSlug;
      }

      //create product with new slug and image path
      const product = await prisma.product.create({
        data: {
          name,
          slug,
          description,
          categoryId,
          price,
          qty,
          image: uploadData.path,
        },
      });

      return jsonResponse(
        {
          message: "Successfully created product",
          data: {
            product: {
              ...product,
              image: PRODUCT_IMAGE_PATH + product.image,
            },
          },
        },
        {
          status: 201, //success created status code
        }
      );
    }
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
