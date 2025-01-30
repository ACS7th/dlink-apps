import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import NaverProvider from "next-auth/providers/naver"

const authOptions = {
    providers: [
        // 1) Google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // 2) Kakao
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
        }),
        // 3) Naver
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
        }),
    ],

    /**
     * NextAuth는 기본적으로 자체 세션/쿠키/JWT 등을 관리합니다.
     * 여기서는 "로그인 여부" 정도만 NextAuth 세션으로 유지하고,
     * 실제 서비스용 JWT는 Spring에서 발급받는 흐름을 보여줍니다.
     */
    session: {
        strategy: "jwt", // 내부적으로 NextAuth가 jwt를 쓰도록 (안 써도 되지만 기본값 유지)
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        /**
         * signIn 콜백:
         * OAuth 로그인 처음 성공할 때 호출됨.
         * account, profile 등으로부터 소셜 토큰/정보를 확인 가능.
         */
        async signIn({ user, account, profile }) {
            // account.access_token: 구글/카카오/네이버 측 액세스 토큰
            // account.provider: 어떤 공급자인지 (google, kakao, naver)
            // user.email / profile.email 등: 사용자 이메일 정보 (플랫폼별 지원 다름)

            // 1) 소셜 토큰을 Spring 서버에 전달하여, 우리 서비스용 JWT를 발급받는 예시
            try {
                const providerAccessToken = account.access_token
                const providerType = account.provider // "google" | "kakao" | "naver"
                console.log(providerAccessToken)
                console.log(providerType)

                // Spring 서버의 /auth/social-login 엔드포인트로 POST
                const response = await fetch(`${process.env.SPRING_URI}/auth/social-login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        provider: providerType,
                        accessToken: providerAccessToken,
                        // 추가로 필요한 정보 있으면 같이 전달 (ex: email, name)
                        email: user.email
                    })
                })

                if (!response.ok) {
                    // Spring 서버가 에러 반환 시 signIn 실패 처리
                    return false
                }

                const data = await response.json()
                /**
                 * data 내부에 우리 서비스용 JWT(Ex: data.jwt)가 있다고 가정
                 * 이 토큰을 브라우저 쿠키나 로컬스토리지에 저장할 수 있음
                 * 
                 * 다만 NextAuth 자체는 이 토큰을 '자동 보관'해주지는 않음.
                 * - 이 콜백은 서버 측에서 도는 로직이므로, 
                 *   직접 Set-Cookie 헤더를 내려 보내거나
                 *   혹은 이후 session 콜백에서 token에 저장하는 등 커스텀 필요
                 */

                // 여기서는 그냥 로그만 찍고 넘어감.
                console.log("Spring JWT:", data.jwt)

                // signIn 성공시키려면 true 리턴
                return true
            } catch (e) {
                console.error("Spring 연동 실패:", e)
                return false
            }
        },

        /**
         * JWT 콜백:
         * NextAuth가 내부적으로 사용하는 JWT에
         * 원하는 정보를 저장하거나, 갱신하는 과정을 커스터마이징할 수 있음.
         */
        async jwt({ token, user, account }) {
            // 예: 로그인 직후(account가 있는 경우) 어떤 custom 필드 저장
            if (account) {
                token.provider = account.provider
            }
            return token
        },

        /**
         * Session 콜백:
         * 클라이언트에서 useSession() 등으로 세션 조회 시 실행됨.
         * token에 있던 정보를 session.user 등에 담아줄 수 있음.
         */
        async session({ session, token }) {
            // session.user에 provider 정보를 덧붙이는 예시
            session.user.provider = token.provider
            return session
        },
    },
}

/**
 * NextAuth를 App Router 방식으로 등록.
 * - GET, POST 메서드 핸들러를 export
 */
const handler = NextAuth(authOptions)

// Next.js 13 (App Router)에서 route.js 안에선 아래처럼 export
export { handler as GET, handler as POST }