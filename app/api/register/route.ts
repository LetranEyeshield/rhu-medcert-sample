import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";


export async function POST(req: Request) {
  try {
    await connectDB();

    const { fullName, faceDesc } =
      await req.json();

    if (!fullName || !faceDesc) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Optional: prevent duplicate fullname
    const existingUser = await User.findOne({ fullName });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    const user = await User.create({
      fullName,
      faceDesc,
    });

    return NextResponse.json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
