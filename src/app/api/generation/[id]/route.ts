import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const id = req.url.split("/").pop(); // Extract id from the last segment of the pathname

    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("id", id);
    console.log("req", req);

    if (!response.ok) {
      const error = await response.json();
      return Response.json(
        { error: error.detail || "Internal server error" },
        { status: 500 }
      );
    }

    const generation = await response.json();
    return Response.json(generation);
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
