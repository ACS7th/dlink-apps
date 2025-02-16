import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const res = await axios.get(`${process.env.SPRING_URI}/api/v1/reviews`, {
      params: { id },
      timeout: 5000,
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("API 호출 오류:", error);
    return NextResponse.json({ error: error.response?.data || '알 수 없는 오류' });
  }
}
