import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import { cookies } from "next/headers";

export const authOptions = {
    providers: [
        // ✅ 일반 로그인 (이메일 & 비밀번호)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "이메일", type: "email", placeholder: "example@example.com" },
                password: { label: "비밀번호", type: "password" }
            },

            async authorize(credentials) {
                try {
                    const formData = new URLSearchParams();
                    formData.append("username", credentials.email);
                    formData.append("password", credentials.password);

                    const response = await fetch(`${process.env.SPRING_URI}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: formData.toString()
                    });

                    // ✅ 에러 처리
                    if (!response.ok) {
                        const result = await response.json();
                        throw new Error(result.error);
                    }

                    // ✅ 헤더에서 JWT 추출
                    const jwt = response.headers.get("Authorization")?.replace("Bearer ", "");
                    if (!jwt) {
                        throw new Error("JWT 토큰 없음");
                    }

                    // ✅ Spring JWT를 httpOnly 쿠키에 저장
                    const cookieStore = await cookies();
                    cookieStore.set({
                        name: "springJwt",
                        value: jwt,
                        path: "/",
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "Strict",
                    });

                    return { id: credentials.email, email: credentials.email, jwt };
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        }),

        // ✅ OAuth 로그인 (Google, Kakao, Naver)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        KakaoProvider({
            clientId: process.env.KAKAO_REST_API,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
        }),

        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
        }),
    ],

    session: {
        strategy: "jwt", // ✅ 내부적으로 JWT 사용
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user, account, credentials }) {
            // ✅ 일반 로그인 (CredentialsProvider) 처리
            if (account?.provider === "credentials") {
                if (!user || !user.email) {
                    console.log("일반 로그인 실패: 사용자 정보 없음");
                    return false;
                }
                return true;
            }

            // ✅ OAuth 로그인 처리 (Google, Kakao, Naver)
            if (account?.provider) {
                console.log(`OAuth 로그인 성공: ${account.provider}, 이메일: ${user.email}`);

                try {
                    // ✅ 소셜 로그인 후 Spring 서버와 연동
                    const response = await fetch(`${process.env.SPRING_URI}/api/v1/auth/social-login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            provider: account.provider, // "google", "kakao", "naver"
                            accessToken: account.access_token,
                            email: user.email,
                            name: user.name,
                            image: user.image
                        })
                    });

                    if (!response.ok) {
                        console.error("Spring 서버 소셜 로그인 연동 실패");
                        return false;
                    }

                    const data = await response.json();
                    const cookieStore = await cookies();

                    // ✅ Spring JWT 쿠키 저장
                    cookieStore.set({
                        name: "springJwt",
                        value: data.jwt,
                        path: "/",
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "Strict",
                    });

                    return true;
                } catch (error) {
                    console.error("Spring 연동 실패:", error.message);
                    return false;
                }
            }

            return false; // 기본적으로 로그인 차단
        },

        async jwt({ token, user }) {
            if (user) {
                token.jwt = user.jwt; // Spring에서 받은 JWT 저장
            }
            return token;
        },

        async session({ session, token }) {
            session.user.jwt = token.jwt; // 클라이언트에서 JWT 접근 가능
            return session;
        },

        async redirect({ url, baseUrl }) {
            return `${baseUrl}/`;
        },
    },
};

/**
 * NextAuth를 App Router 방식으로 등록.
 * - GET, POST 메서드 핸들러를 export
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
