import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
    providers: [
        // ✅ 일반 로그인 (이메일 & 비밀번호)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "이메일",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "비밀번호", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("이메일과 비밀번호를 입력하세요.");
                }

                try {
                    const formData = new URLSearchParams();
                    formData.append("username", credentials.email);
                    formData.append("password", credentials.password);

                    const response = await fetch(
                        `${process.env.SPRING_URI as string}/api/v1/auth/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded",
                            },
                            body: formData.toString(),
                        }
                    );

                    if (!response.ok) {
                        const result = await response.json();
                        throw new Error(result.error || "로그인 실패");
                    }

                    // ✅ 헤더에서 Spring 서버가 발급한 JWT 추출
                    const jwt = response.headers
                        .get("Authorization")
                        ?.replace("Bearer ", "");
                    if (!jwt) {
                        throw new Error("JWT 토큰 없음");
                    }

                    return {
                        id: credentials.email,
                        email: credentials.email,
                        jwt,
                    };
                } catch (error: any) {
                    throw new Error(error.message);
                }
            },
        }),

        // ✅ OAuth 로그인 (Google, Kakao, Naver)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        KakaoProvider({
            clientId: process.env.KAKAO_REST_API as string,
            clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
        }),

        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID as string,
            clientSecret: process.env.NAVER_CLIENT_SECRET as string,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET as string,

    callbacks: {
        async signIn({ user, account}) {
            if (account?.provider === "credentials") {
                if (!user || !user.email) {
                    console.log("일반 로그인 실패: 사용자 정보 없음");
                    return false;
                }
                return true;
            }

            if (account?.provider) {
                console.log(
                    `OAuth 로그인 성공: ${account.provider}, 이메일: ${user.email}`
                );

                try {
                    const response = await fetch(
                        `${
                            process.env.SPRING_URI as string
                        }/api/v1/auth/social-login`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                provider: account.provider,
                                accessToken: account.access_token,
                                email: user.email,
                                name: user.name,
                                image: user.image,
                            }),
                        }
                    );

                    if (!response.ok) {
                        console.error("Spring 서버 소셜 로그인 연동 실패");
                        return false;
                    }

                    return true;
                } catch (error: any) {
                    console.error("Spring 연동 실패:", error.message);
                    return false;
                }
            }

            return false;
        },

        // ✅ Spring 서버의 JWT를 NextAuth의 JWT 토큰으로 저장
        async jwt({ token, user }) {
            if (user?.jwt) {
                token.jwt = user.jwt;
            }
            return token;
        },

        // ✅ 클라이언트에서 NextAuth 세션을 요청하면 Spring JWT를 반환
        async session({ session, token }) {
            session.user.jwt = token.jwt as string; 
            return session;
        },

        async redirect({ baseUrl }) {
            return `${baseUrl}/`;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
