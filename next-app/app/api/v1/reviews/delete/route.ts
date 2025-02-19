import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const drinkId = searchParams.get("drinkId");
  const userId = searchParams.get("userId");

  if (!category || !drinkId || !userId) {
    return NextResponse.json(
      { error: 'category, drinkId, userId가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const backendURL = `${process.env.SPRING_URI}/api/v1/review/${category}/${drinkId}/${userId}`;
    const response = await axios.delete(backendURL, { timeout: 5000 });
    console.log('요청 URL:', backendURL);
    console.log('리뷰 삭제 성공:', response.data);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("리뷰 삭제 오류:", error);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
