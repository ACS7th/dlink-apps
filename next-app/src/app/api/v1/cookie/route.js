import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
    try {
        const cookie = await cookies();
        cookie.delete("springJwt");

        return NextResponse.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("로그아웃 실패:", error);
        return NextResponse.json({ error: "로그아웃 실패" }, { status: 500 });
    }
}
