import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

const { json: jsonResponse } = NextResponse;

export const POST = async (request: Request) => {
  try {
    const { name, email, password } = await request.json();

    //check if email already exist in database or not
    const isUserExisted = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    //if so, then throw error email already exist
    if (isUserExisted) {
      return jsonResponse(
        {
          message: "Email Already Exist",
        },
        {
          status: 409, //conflict status code
        }
      );
    }

    //if email don't exist continue creating user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password, 10), //encrypt password
      },
    });

    // exlude password from response, (note: you can customize the response object before send to client)
    const { password: _, ...restUser } = user;

    return jsonResponse(
      {
        message: "Successfully registered user",
        data: restUser,
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
