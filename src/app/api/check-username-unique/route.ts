import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log({ result });
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          status: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    console.log({ existingVerifiedUser });
    if (existingVerifiedUser) {
      return Response.json(
        {
          status: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        status: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error checking username", error);
    return Response.json(
      {
        status: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
