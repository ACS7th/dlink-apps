import apiSpring from '@/utils/apiSpring';
import { NextResponse } from 'next/server';

export async function PUT(request) {
    try {
        const data = await request.json();

        const res = await apiSpring.put('/api/v1/auth/user', data, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return NextResponse.json(res.data);
    } catch (error) {
        return NextResponse.json(error.response.data || { message: "서버 오류 발생" }, { status: error.response?.status || 500 });
    }
}