// import axios from 'axios';
// import { NextRequest, NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

// export async function PUT(request: NextRequest): Promise<NextResponse> {
//   const { searchParams } = new URL(request.url);
//   const category = searchParams.get("category");
//   const recipeId = searchParams.get("recipeId");
//   const userId = searchParams.get("userId");

//   if (!category || !recipeId || !userId) {
//     return NextResponse.json(
//       { error: 'category, recipeId, userId가 필요합니다.' },
//       { status: 400 }
//     );
//   }

//   try {
//     // 클라이언트에서 multipart/form-data로 전송한 데이터를 읽습니다.
//     const formData = await request.formData();

//     // 쿼리 스트링에 필요한 값들을 FormData에서 꺼내어 URL에 추가합니다.
//     const name = encodeURIComponent(formData.get("name") as string);
//     const making = encodeURIComponent(formData.get("making") as string);
//     // 여기서는 재료는 formData에 그대로 담아 백엔드가 처리하도록 합니다.
//     // (백엔드 문서에 따르면 key는 "ingredients")
//     const backendURL =
//       `${process.env.SPRING_URI}/api/v1/highball/recipe/${encodeURIComponent(recipeId)}` +
//       `?userId=${encodeURIComponent(userId)}&category=${encodeURIComponent(category)}` +
//       `&name=${name}&making=${making}`;
//     console.log('PUT 요청 URL:', backendURL);

//     // axios.put()에 FormData를 전달하면 자동으로 multipart/form-data로 전송됩니다.
//     const res = await axios.put(backendURL, formData, { timeout: 5000 });
//     console.log('레시피 수정 성공:', res.data);
//     return NextResponse.json(res.data, { status: 200 });
//   } catch (error: any) {
//     console.error("레시피 수정 오류:", error);
//     return NextResponse.json(
//       { error: error.response?.data || error.message },
//       { status: 500 }
//     );
//   }
// }


import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const recipeId = searchParams.get("recipeId");
  const userId = searchParams.get("userId");

  if (!category || !recipeId || !userId) {
    return NextResponse.json(
      { error: 'category, recipeId, userId가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 클라이언트에서 FormData를 읽음
    const formData = await request.formData();

    // 쿼리 스트링에 필요한 값들을 FormData에서 꺼내 URL에 추가
    const name = encodeURIComponent(formData.get("name") as string);
    const making = encodeURIComponent(formData.get("making") as string);

    const backendURL =
      `${process.env.SPRING_URI}/api/v1/highball/recipe/${encodeURIComponent(recipeId)}` +
      `?userId=${encodeURIComponent(userId)}&category=${encodeURIComponent(category)}` +
      `&name=${name}&making=${making}`;
    console.log('PUT 요청 URL:', backendURL);

    // axios.put()으로 FormData 전송
    const res = await axios.put(backendURL, formData, { timeout: 5000 });
    console.log('레시피 수정 성공:', res.data);

    // 백엔드가 JSON 형식의 응답을 반환한다면 아래와 같이 반환
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    console.error("레시피 수정 오류:", error);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
