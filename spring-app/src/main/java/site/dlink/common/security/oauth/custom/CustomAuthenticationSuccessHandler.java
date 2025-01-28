package site.dlink.common.security.oauth.custom;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.dlink.common.security.jwt.contants.JwtConstants;
import site.dlink.common.security.jwt.provider.JwtTokenProvider;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        // OAuth2User로 캐스팅하여 인증된 사용자 정보를 가져온다.
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        // 사용자 이메일을 가져온다.
        String email = oAuth2User.getAttribute("email");
        // 서비스 제공 플랫폼(GOOGLE, KAKAO, NAVER)이 어디인지 가져온다.
        String provider = oAuth2User.getAttribute("provider");
        // CustomOAuth2UserService에서 셋팅한 로그인한 회원 존재 여부를 가져온다.
        Boolean isExist = oAuth2User.getAttribute("isExist");
        // OAuth2User로부터 Role을 얻어온다.
        // OAuth2User로부터 Role을 얻어온다.
        List<String> roles = oAuth2User.getAuthorities()
                .stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toList());

        // 회원이 존재하지 않을 경우
        if (!isExist) {
            // 회원가입 페이지 url 생성
            String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/join")
                    .queryParam("email", (String) oAuth2User.getAttribute("email"))
                    .queryParam("provider", provider)
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString();

            // 회원가입 페이지로 리다이렉트 시킨다.
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        }

        if (isExist) {
            Long userId = oAuth2User.getAttribute("userId");
            String token = jwtTokenProvider.createToken(userId, email, roles);

            // 회원이 존재하면 jwt token 발행을 시작한다.
            log.info("jwtToken = {}", token);

            // JWT를 헤더에 추가
            response.addHeader(JwtConstants.TOKEN_HEADER, JwtConstants.TOKEN_PREFIX + token);

            // 리다이렉트 URL 설정
            String targetUrl = "http://localhost:3000/";

            // 리다이렉트 수행
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        }

    }
}
