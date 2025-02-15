import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // URL 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const engName = searchParams.get('engName');
    const korName = searchParams.get('korName');
    const category = searchParams.get('category');
    const making = searchParams.get('making');
    const ingredientsJSON = searchParams.get('ingredientsJSON');

    // 클라이언트 요청의 multipart/form-data 파싱 (이미지 파일 전송을 위해)
    const formData = await request.formData();
    const imageFile = formData.get('imageFile'); // 선택적 파일

    // 백엔드 전송용 FormData (이미지 파일만 전송)
    const backendFormData = new FormData();
    if (imageFile && imageFile.size > 0) {
      backendFormData.append('imageFile', imageFile, imageFile.name);
    }

    // 쿼리 파라미터를 포함한 백엔드 URL 구성
    const queryParams = new URLSearchParams({
      userId,
      engName,
      korName,
      category,
      making,
      ingredientsJSON,
    });
    const backendURL = `${process.env.SPRING_URI}/api/v1/highball/recipe?${queryParams.toString()}`;

    console.log(backendURL)
    console.log(backendURL)
    console.log(backendURL)
    console.log(backendURL)
    console.log(backendURL)
    console.log(backendURL)
    // 백엔드 API에 POST 요청 (axios가 multipart/form-data 전송)
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
