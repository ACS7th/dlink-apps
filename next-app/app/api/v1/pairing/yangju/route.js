import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const receivedData = await request.json();

    const response = await axios.post(
      `${process.env.SPRING_URI}/api/v1/pairing/yangju`, receivedData
    );

    return NextResponse.json({
      data: response.data,
    });
  } catch (error) {
    console.error("데이터 전송 에러:", error);
    return NextResponse.json(
      { error: error.response?.data || error.message || "알 수 없는 오류" },
      { status: 500 }
    );
  }
}
