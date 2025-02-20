export const dynamic = 'force-dynamic';

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "상품 id가 필요합니다." }, { status: 400 });
    }

    const res = await axios.get(`${process.env.SPRING_URI}/api/v1/alcohols/${id}`)
    console.log("상품 상세 정보:", res.data);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("API 호출 오류:", error);
    return NextResponse.json({ error: error.response?.data || '알 수 없는 오류' });
  }
}
