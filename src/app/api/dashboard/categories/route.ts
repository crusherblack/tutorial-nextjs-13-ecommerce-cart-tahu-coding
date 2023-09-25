import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

const { json: jsonResponse } = NextResponse;

export const GET = async (_request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return jsonResponse(
      {
        message: "Successfully get categories",
        data: {
          categories,
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
