import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    console.log("category:", category);

    if (!category) {
      return NextResponse.json({ error: "카테고리 값이 필요합니다." }, { status: 400 });
    }

    const backendURL = `${process.env.SPRING_URI}/api/v1/highball/category`;
    const res = await axios.get(backendURL, {
      params: { category },
      timeout: 5000,
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("하이볼 레시피 API 요청 오류:", error);
    return NextResponse.json(
      { error: error.response?.data || '알 수 없는 오류' },
      { status: 500 }
    );
  }
}
