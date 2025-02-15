import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import jwt from "jsonwebtoken"; // ✅ JWT 파싱
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
          // 폼데이터 전송 (x-www-form-urlencoded)
          const formData = new URLSearchParams();
          formData.append("username", credentials.email);
          formData.append("password", credentials.password);

          const response = await fetch(
            `${process.env.SPRING_URI as string}/api/v1/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: formData.toString(),
            }
          );

          if (!response.ok) {
            // 로그인 실패 시 에러 메시지 추출
            const result = await response.json();
            throw new Error(result.error || "로그인 실패");
          }

          // ✅ 헤더에서 Spring 서버가 발급한 JWT 추출
          const jwtHeader = response.headers.get("Authorization"); // Bearer ...
          const jwtToken = jwtHeader?.replace("Bearer ", "");
          if (!jwtToken) {
            throw new Error("JWT 토큰이 존재하지 않습니다.");
          }

          // ✅ user 반환 (NextAuth의 user 객체)
          return {
            // NextAuth 내부용 식별자
            id: credentials.email,
            // 이메일
            email: credentials.email,
            // Spring JWT
            jwt: jwtToken,
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),

    // ✅ Google 로그인
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // ✅ Kakao 로그인
    KakaoProvider({
      clientId: process.env.KAKAO_REST_API as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),

    // ✅ Naver 로그인
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string,
    }),
  ],

  session: {
    strategy: "jwt", // JWT 전략
  },

  secret: process.env.NEXTAUTH_SECRET as string,

  callbacks: {
    // (1) signIn: 인증 흐름 제어
    async signIn({ user, account }) {
      // 1) 일반 로그인
      if (account?.provider === "credentials") {
        if (!user || !user.email) {
          console.log("일반 로그인 실패: 사용자 정보 없음");
          return false;
        }
        return true;
      }

      // 2) OAuth 로그인
      if (account?.provider) {
        console.log(
          `OAuth 로그인 성공: ${account.provider}, 이메일: ${user.email}`
        );

        try {
          // ✅ 소셜 로그인 후, Spring 서버로 토큰 전달 & JWT 획득
          const response = await fetch(
            `${process.env.SPRING_URI as string}/api/v1/auth/social-login`,
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

          // ✅ 예: JSON 바디에 { jwt: "..." } 형태로 JWT가 있다고 가정
          const result = await response.json();
          if (!result.jwt) {
            console.error("소셜 로그인: JWT 토큰이 존재하지 않음");
            return false;
          }

          // ✅ user 객체에 JWT 저장 (추후 jwt callback에서 파싱)
          user.jwt = result.jwt;
          return true;
        } catch (error: any) {
          console.error("Spring 연동 실패:", error.message);
          return false;
        }
      }

      return false;
    },

    // (2) jwt: user -> token 변환
    async jwt({ token, user }) {
      // ✅ 최초 로그인 시(user 존재), JWT 추가
      if (user?.jwt) {
        token.jwt = user.jwt;

        // 여기서 JWT 파싱
        try {
          const decoded = jwt.decode(user.jwt) as jwt.JwtPayload & {
            uid?: string;
            eml?: string;
            nam?: string;
            rol?: string[]; // roles
          };

          if (decoded) {
            // Spring JWT에서 발급한 클레임을 token에 저장
            // uid, eml, nam, rol 등
            token.uid = decoded.uid;
            token.eml = decoded.eml;
            token.nam = decoded.nam;
            token.rol = decoded.rol;
          }
        } catch (err) {
          console.error("JWT 디코딩 실패:", err);
        }
      }
      return token;
    },

    // (3) session: token -> session 변환
    async session({ session, token }) {
      // ✅ 세션에 JWT 및 클레임 포함
      session.user.jwt = token.jwt as string;

      // Spring JWT 필드들
      session.user.id = token.uid as string | undefined;    // uid
      session.user.email = token.eml as string | undefined; // eml
      session.user.name = token.nam as string | undefined;  // nam
      session.user.roles = token.rol as string[] | undefined; // rol

      return session;
    },

    // (4) 인증 후 리다이렉트 경로
    async redirect({ baseUrl }) {
      return `${baseUrl}/`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
