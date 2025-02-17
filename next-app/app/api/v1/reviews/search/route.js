import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const drinkId = searchParams.get("drinkId");

    console.log("Request Params:", category, drinkId); // 디버깅용

    if (!category || !drinkId) {
      return new Response(JSON.stringify({ message: "category and drinkId are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const backendUrl = `http://api-gateway:9999/api/v1/review/${category}/${drinkId}`;
    console.log("Backend API URL:", backendUrl); // 디버깅용

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: { Accept: "*/*" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend Error Response:", errorData); // 디버깅
      return new Response(JSON.stringify({ message: "Failed to fetch reviews", error: errorData }), {
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
    console.error("Internal Server Error:", error); // 디버깅
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
