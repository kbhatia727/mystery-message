import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  //as we have converted to string before storing in session
  const userId = new mongoose.Types.ObjectId(user._id);
  console.log({ userId });
  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      { $unwind: "$messages" },
      {
        $sort: { "messages.createdAt": -1 },
      },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length == 0) {
      return Response.json(
        {
          status: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        status: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: false,
        message: "Failed to get messages",
      },
      { status: 500 }
    );
  }
}
