import apiSpring from '@/helpers/apiSpring';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const data = await request.json();

        const response = await apiSpring.post('/api/v1/auth/user', data);

        return NextResponse.json(response.data, { status: 201 });

    } catch (error) {
        if (error.response) {
            return NextResponse.json({ message: "이미 존재하는 회원입니다." }, { status: error.response.status });
        }

        return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
    }
}