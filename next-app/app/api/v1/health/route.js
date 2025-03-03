import { NextResponse } from "next/server";

export async function GET() {
  console.log(`[Health Check] 요청 수신: ${new Date().toISOString()}`);

  try {
    // 정상적인 상태 반환
    return NextResponse.json({ status: "ok" }, { status: 200 });

  } catch (error) {
    // 예외 발생 시 오류 반환
    console.error(`[Health Check] 실패 ❌ - 오류: ${error.message}`);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
