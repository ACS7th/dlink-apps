// /app/api/v1/highball/like/route.js (예시)
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id || !email) {
      return NextResponse.json(
        { error: 'id와 email이 필요합니다.' },
        { status: 400 }
      );
    }

    // id를 경로에 포함시키도록 URL 수정
    const res = await axios.post(
      `http://api-gateway:9999/api/v1/highball/${encodeURIComponent(id)}/like?email=${encodeURIComponent(email)}`,
      null,
      { timeout: 5000 }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
