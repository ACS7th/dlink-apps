import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const drinkId = searchParams.get("drinkId");

    if (!category || !drinkId) {
      return new Response(
        JSON.stringify({ message: "category and drinkId are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const backendUrl = `${process.env.SPRING_URI}/api/v1/review/${category}/${drinkId}`;
    console.log("Backend API URL:", backendUrl); // 디버깅

    // axios는 .ok가 아닌 status 코드로 판별
    const response = await axios.get(backendUrl, {
      headers: { Accept: "application/json" },
    });

    console.log("Axios Response:", response.data); // 응답 로그

    return new Response(
      JSON.stringify(response.data),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Backend Error:", error.response.data); // 백엔드 응답 에러
      return new Response(
        JSON.stringify({
          message: "Failed to fetch reviews",
          error: error.response.data,
        }),
        { status: error.response.status, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Internal Server Error:", error); // 내부 서버 에러
      return new Response(
        JSON.stringify({ message: "Internal Server Error", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
