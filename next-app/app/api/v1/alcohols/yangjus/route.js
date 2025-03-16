import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 0;
    const size = searchParams.get('size') || 10;

    // ✅ subcategory 제거 → 모든 양주 데이터를 가져옴
    const res = await axios.get(`${process.env.SPRING_URI}/api/v1/alcohols/yangjus`, {
      params: { page, size },
      timeout: 5000,
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("API 호출 오류:", error);
    return NextResponse.json(
      { error: error.response?.data || '알 수 없는 오류' },
      { status: error.response?.status || 500 }
    );
  }
}
