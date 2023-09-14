import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

const { json: jsonResponse } = NextResponse;

export const POST = async (request: NextRequest) => {
  try {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const res = await request.formData();

    //lanjutkan buat save ke db dan upload ke bucket
    const formData = {
      name: res.get("name"),
      image: res.get("image"),
    };

    //check if email already exist in database or not

    return jsonResponse(
      {
        message: "Successfully registered user",
        data: session,
        res,
      },
      {
        status: 201, //success created status code
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
    });

    return jsonResponse(
      {
        message: "Successfully get products",
        data: {
          products,
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
