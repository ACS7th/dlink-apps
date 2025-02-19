import axios from 'axios';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // URL에서 query parameters 추출 (테스트 요청 시 이미 URL에 포함되어 있음)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    // formData 파싱 (name, making, ingredients, imageFile)
    const formData = await request.formData();
    const name = formData.get("name");
    const making = formData.get("making");
    const ingredients = formData.get("ingredients"); // JSON 문자열, 예: {" ㅇ ":" ㅇ "}
    const imageFile = formData.get("imageFile"); // 선택적 파일

    // 백엔드에 전달할 query parameters 구성: userId, name, category, making
    const queryParams = new URLSearchParams({
      userId,
      name,
      category,
      making,
    });

    // 백엔드 API URL 구성 (예: http://localhost:9999/api/v1/highball/recipe?userId=...&name=...&category=...&making=...)
    const backendURL = `${process.env.SPRING_URI}/api/v1/highball/recipe?${queryParams.toString()}`;
    console.log("Backend URL:", backendURL);

    // 백엔드 전송용 FormData 구성 (imageFile와 ingredients)
    const backendFormData = new FormData();
    if (imageFile && imageFile.size > 0) {
      backendFormData.append("imageFile", imageFile, imageFile.name);
    }
    if (ingredients) {
      backendFormData.append("ingredients", ingredients);
    }

    // 백엔드 API에 POST 요청 (axios 사용, multipart/form-data 전송)
    const res = await axios.post(backendURL, backendFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 5000,
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("API 호출 오류:", error);
    return NextResponse.json(
      { error: error.response?.data || '알 수 없는 오류' },
      { status: 500 }
    );
  }
}