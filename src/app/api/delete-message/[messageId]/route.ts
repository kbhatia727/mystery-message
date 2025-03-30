import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = await params;
  console.log({ params });
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

  try {
    const result = await UserModel.updateOne(
      {
        _id: user._id,
      },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount == 0) {
      return Response.json(
        {
          status: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        status: true,
        messages: "Message deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
