import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

import { PRODUCT_IMAGE_PATH } from "@/constant";

const { json: jsonResponse } = NextResponse;

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);

  const category = url.searchParams.get("category") || "";

  try {
    //add filter by category if existed
    let where = {};

    if (category) {
      where = {
        category: {
          slug: category,
        },
      };
    }

    const products = await prisma.product.findMany({
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
