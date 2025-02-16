import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let category = searchParams.get("category");
    console.log("category", category);

    if (!category) {
      return NextResponse.json({ error: "카테고리 값이 필요합니다." }, { status: 400 });
    }

    // // 첫 글자를 대문자로, 나머지는 소문자로 변환 (예: whiskey -> Whiskey)
    // category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    const res = await axios.get(`${process.env.SPRING_URI}/api/v1/highball/category?category=${encodeURIComponent(category)}`, {
      params: { category },
      timeout: 5000,
    }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("하이볼 레시피 API 요청 오류:", error);
    return NextResponse.json(
      { error: error.response?.data || '알 수 없는 오류' },
      { status: 500 }
    );
  }
}
