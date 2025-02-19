import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function DELETE(request) {
  try {
    // 요청 URL에서 query parameters 추출
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    console.log("삭제할 레시피 ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: '삭제할 레시피 id가 필요합니다.' },
        { status: 400 }
      );
    }

    const backendURL = `${process.env.SPRING_URI}/api/v1/highball/recipe/${encodeURIComponent(id)}`;
    console.log("백엔드 DELETE URL:", backendURL);

    // axios DELETE 요청
    const res = await axios.delete(backendURL, { timeout: 5000 });

    console.log("백엔드 DELETE 응답 데이터:", res.data);

    return NextResponse.json({ message: res.data }, { status: 200 });

  } catch (error) {
    console.error("레시피 삭제 오류:", error);

    let errorMessage = '알 수 없는 오류';
    let statusCode = 500;

    if (error.response) {
      errorMessage = error.response.data || '서버 응답 오류';
      statusCode = error.response.status || 500;
    } else if (error.request) {
      errorMessage = '백엔드와 통신할 수 없습니다.';
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
