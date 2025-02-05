import apiSpring from "@/utils/apiSpring";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { data } = await apiSpring.get("/api/v1/auth/info");

        return NextResponse.json(data);
    } catch (error) {
        console.error("Spring API 요청 실패:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}


export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const jwtCookie = cookieStore.get("springJwt")?.value;

        if (!jwtCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ jwt: jwtCookie });
    } catch (error) {
        console.error("Spring API 요청 실패:", error);
        return NextResponse.json({ error: "Spring API 요청 실패" }, { status: 500 });
    }
}