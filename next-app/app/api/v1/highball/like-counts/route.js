export const dynamic = 'force-dynamic';

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id가 필요합니다.' },
        { status: 400 }
      );
    }

    const res = await axios.get(
      `${process.env.SPRING_URI}/api/v1/highball/${encodeURIComponent(id)}/like-count`,
      { timeout: 5000, headers: { Accept: 'application/json' } }
    );


    return NextResponse.json(res.data);
  } catch (error) {
    console.error('좋아요 수 조회 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
