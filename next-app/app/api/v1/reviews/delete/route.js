import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  try {
    const { category, drinkId, userId } = params;
    if (!category || !drinkId || !userId) {
      return NextResponse.json(
        { error: 'category, drinkId, userId가 필요합니다.' },
        { status: 400 }
      );
    }
    const backendURL = `${process.env.SPRING_URI}/api/v1/review/${category}/${drinkId}/${userId}`;
    const res = await axios.delete(backendURL, { timeout: 5000 });
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("리뷰 삭제 오류:", error);
    return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
  }
}
