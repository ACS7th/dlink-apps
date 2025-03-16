import apiSpring from '@/helpers/apiSpring';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const email = body.email;
        const code = body.code;

        if (!email || !code) {
            return NextResponse.json({ message: "이메일과 인증 코드를 입력하세요." }, { status: 400 });
        }

        const res = await apiSpring.post(`/api/v1/auth/email/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);

        return NextResponse.json(res.data);
    } catch (error) {
        return NextResponse.json(error.response?.data || { message: "서버 오류 발생" }, { status: error.response?.status || 500 });
    }
}
