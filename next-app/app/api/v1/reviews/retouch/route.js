import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const { category, drinkId, userId } = params;
    const body = await request.json(); // { rating, content } 형식의 JSON
    if (!category || !drinkId || !userId) {
      return NextResponse.json(
        { error: 'category, drinkId, userId가 필요합니다.' },
        { status: 400 }
      );
    }
    const backendURL = `${process.env.SPRING_URI}/api/v1/review/${category}/${drinkId}/${userId}`;
    const res = await axios.put(backendURL, body, { timeout: 5000 });
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("리뷰 수정 오류:", error);
    return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
  }
}
