import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const page = searchParams.get('page') || 0;
    const size = searchParams.get('size') || 10;

    const res = await axios.get(`http://api-gateway:9999/api/v1/alcohols/yangjus/search`, {
      params: { keyword, page, size },
      timeout: 5000,
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("API 호출 오류:", error);
    return NextResponse.json({ error: error.response?.data || '알 수 없는 오류' });
  }
}
