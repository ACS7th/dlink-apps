import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { category, drinkId, userId, rating, content } = await req.json();

    if (!category || !drinkId || !userId || !rating || !content) {
      return new Response(JSON.stringify({ message: "All fields are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const backendUrl = `http://localhost:9999/api/v1/review/${category}/${drinkId}/${userId}`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ rating, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ message: "Failed to add review", error: errorData }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const responseData = await response.json();
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

