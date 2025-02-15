import axios from 'axios';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: '삭제할 레시피 id가 필요합니다.' }, { status: 400 });
    }

    const res = await axios.delete(
      `http://api-gateway:9999/api/v1/highball/delete?id=${encodeURIComponent(id)}`,
      {
        timeout: 5000,
        headers: { Accept: 'application/json' },
      }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    console.error('하이볼 레시피 삭제 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
