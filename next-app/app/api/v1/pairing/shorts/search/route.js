import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dish = searchParams.get("dish");

    if (!dish) {
      return NextResponse.json(
        { error: "검색할 요리명이 필요합니다." },
        { status: 400 }
      );
    }

    const springUrl = `${process.env.SPRING_URI}/api/v1/pairing/shorts/search?dish=${encodeURIComponent(dish)}`;
    console.log("Spring URL:", springUrl);

    const springResponse = await fetch(springUrl);
    if (!springResponse.ok) {
      const errorText = await springResponse.text();
      return NextResponse.json(
        { error: "Spring API 호출 실패", details: errorText },
        { status: springResponse.status }
      );
    }

    const resultString = await springResponse.text();
    return NextResponse.json({ result: resultString });
  } catch (error) {
    console.error("YouTube Shorts 검색 API 오류:", error);
    return NextResponse.json(
      { error: error.message || "알 수 없는 오류" },
      { status: 500 }
    );
  }
}
