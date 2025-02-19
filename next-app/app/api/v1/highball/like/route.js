import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id와 userId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 백엔드 API URL 구성: /api/v1/highball/{id}/like?userId=...
    const backendURL = `${process.env.SPRING_URI}/api/v1/highball/${encodeURIComponent(id)}/like?userId=${encodeURIComponent(userId)}`;
    console.log("백엔드 DELETE URL:", backendURL);

    const res = await axios.post(backendURL, null, { timeout: 5000 });
    console.log("백엔드 DELETE 응답 데이터:", res.data);

    return NextResponse.json(res.data);
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
