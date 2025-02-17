import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function DELETE(request,) {
  try {
    const { id } = new URL(request.url);
    // const { id } = params;
    console.log("삭제할 레시피 ID:", id);
    if (!id) {
      return NextResponse.json(
        { error: '삭제할 레시피 id가 필요합니다.' },
        { status: 400 }
      );
    }

    // 백엔드 API URL 구성: 백엔드 API는 /api/v1/highball/recipe/{id} 형식으로 요청 받습니다.
    const backendURL = `${process.env.SPRING_URI}/api/v1/highball/recipe/${encodeURIComponent(id)}`;
    console.log("백엔드 DELETE URL:", backendURL);

    // axios로 백엔드 DELETE 요청 전송
    const res = await axios.delete(backendURL, { timeout: 5000 });
    console.log("백엔드 DELETE 응답 데이터:", res.data);

    // 백엔드에서 텍스트 응답(예: "레시피 삭제 성공: {id}")을 반환하므로 그대로 전달
    return NextResponse.text(res.data);
  } catch (error) {
    console.error("레시피 삭제 오류:", error);
    const errMsg = error.response?.data || '알 수 없는 오류';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
