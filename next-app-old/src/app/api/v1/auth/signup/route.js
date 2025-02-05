import apiSpring from '@/utils/apiSpring';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const data = await request.json();

    apiSpring.post('/api/v1/auth/user',
        data,
        {
            headers: {
                "Content-Type": "application/json"
            }
        },
    ).then((res) => {
        console.log("정상 응답")
        return NextResponse.json(res.data);
    }).catch((error) => {
        return NextResponse.json(error.response);
    });

    return NextResponse.json({ message: "알 수 없는 오류" });
}