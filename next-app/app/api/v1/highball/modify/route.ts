import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const recipeId = searchParams.get("recipeId");
  const userId = searchParams.get("userId");

  if (!category || !recipeId || !userId) {
    return NextResponse.json(
      { error: 'category, recipeId, userId가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 클라이언트에서 multipart/form-data로 전송한 FormData 읽기
    const formData = await request.formData();
    // URL 쿼리에는 userId, category, recipeId만 포함 (name, making 등은 FormData에 포함)
    const backendURL = `${process.env.SPRING_URI}/api/v1/highball/recipe/${encodeURIComponent(recipeId)}?userId=${encodeURIComponent(userId)}&category=${encodeURIComponent(category)}`;
    console.log('PUT 요청 URL:', backendURL);

    // axios가 FormData를 전달받으면 자동으로 multipart/form-data 헤더를 설정합니다.
    const res = await axios.put(backendURL, formData, { timeout: 5000 });
    console.log('레시피 수정 성공:', res.data);
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    console.error("레시피 수정 오류:", error);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
