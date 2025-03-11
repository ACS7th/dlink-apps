import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const receivedData = await request.json();

    const response = await axios.post(
      `${process.env.AWS_GATEWAY_URI}/chatbot/chat`, receivedData
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("chatbot api request error:", error);
    return NextResponse.json(
      { error: error.response?.data || error.message || "알 수 없는 오류" },
      { status: 500 }
    );
  }
}
