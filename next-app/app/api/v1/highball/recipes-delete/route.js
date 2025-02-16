import axios from 'axios';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: '삭제할 레시피 id가 필요합니다.' },
        { status: 400 }
      );
    }

    // 백엔드 API URL 구성
    const backendURL = `http://192.168.56.100:9999/api/v1/highball/recipe/${encodeURIComponent(id)}`;

    const res = await axios.delete(backendURL, {
      timeout: 5000,
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("레시피 삭제 오류:", error);
    return NextResponse.json(
      { error: error.response?.data || '알 수 없는 오류' },
      { status: 500 }
    );
  }
}
