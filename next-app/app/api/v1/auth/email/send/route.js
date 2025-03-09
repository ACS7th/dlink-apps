import apiSpring from '@/helpers/apiSpring';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const email = body.email; 

        if (!email) {
            return NextResponse.json({ message: "이메일이 제공되지 않았습니다." }, { status: 400 });
        }

        const res = await apiSpring.post(`/api/v1/auth/email/send?email=${encodeURIComponent(email)}`);

        return NextResponse.json(res.data);
    } catch (error) {
        return NextResponse.json(error.response?.data || { message: "서버 오류 발생" }, { status: error.response?.status || 500 });
    }
}
