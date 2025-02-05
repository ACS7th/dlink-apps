import apiSpring from '@/utils/apiSpring';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const data = await request.json();

    apiSpring.post('/login',
        data,
        {
            headers: {
                "Content-Type": "application/json"
            }
        },
    ).then((res) => {
        return NextResponse.json(res.data);
    }).catch((error) => {
        return NextResponse.json(error.response);
    });

    return NextResponse.json({ message: "알 수 없는 오류" });
}