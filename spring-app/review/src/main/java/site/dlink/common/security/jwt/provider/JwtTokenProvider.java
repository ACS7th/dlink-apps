package site.dlink.common.security.jwt.provider;

import lombok.extern.slf4j.Slf4j;
import site.dlink.auth.entity.User;
import site.dlink.auth.props.JwtProps;
import site.dlink.auth.repository.UserRepository;
import site.dlink.common.security.jwt.contants.JwtConstants;
import site.dlink.common.security.jwt.custom.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {

    @Autowired
    private JwtProps jwtProps;
    @Autowired
    private UserRepository userRepository;

    public String createToken(long userId, String username, List<String> roles) {
        // JWT 토큰 생성
        String jwt = Jwts.builder()
                .signWith(getShaKey(), Jwts.SIG.HS512)      // 서명에 사용할 키와 알고리즘 설정
                .header()                                                      // update (version : after 1.0)
                .add("typ", JwtConstants.TOKEN_TYPE)                   // 헤더 설정 (JWT)
                .and()
                .expiration(new Date(System.currentTimeMillis() + 864000000))  // 토큰 만료 시간 설정 (10일)
                .claim("uid", "" + userId)                                // 클레임 설정: 사용자 번호
                .claim("usn", username)                                     // 클레임 설정: 사용자 아이디
                .claim("rol", roles)                                      // 클레임 설정: 권한
                .compact();

        log.debug("jwt 생성 완료 : {}", jwt);

        return jwt;
    }

    /**
     * 요청 헤더 내 JWT(Bearer ...)를 파싱하여 인증(Authentication) 객체를 생성
     *
     * @param authHeader "Authorization" 헤더값 (예: "Bearer xxxxxxx")
     * @return UsernamePasswordAuthenticationToken (인증 성공 시), null(인증 실패 시)
     */
    public UsernamePasswordAuthenticationToken getAuthentication(String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            log.warn("인증 헤더가 비어있습니다.");
            return null;
        }

        try {

            // "Bearer " 접두어 제거
            String jwt = authHeader.replace(JwtConstants.TOKEN_PREFIX, "").trim();
            if (jwt.isEmpty()) {
                log.warn("JWT 토큰이 비어있습니다.");
                return null;
            }

            // JWT 파싱 및 서명 검증
            Jws<Claims> parsedToken = Jwts.parser()
                    .verifyWith(getShaKey()) // secretKey 설정
                    .build()
                    .parseSignedClaims(jwt);

            Claims claims = parsedToken.getPayload();

            // 사용자 식별자
            Object uidObj = claims.get("uid");
            if (uidObj == null) {
                log.warn("JWT 클레임에 사용자 식별자(uid)가 없습니다.");
                return null;
            }
            long userId = Long.parseLong(uidObj.toString());

            // 사용자 이름/아이디
            String username = (String) claims.get("usn");
            if (username == null || username.isEmpty()) {
                log.warn("JWT 클레임에 사용자 이름(usn)이 없습니다.");
                return null;
            }

            // DB에서 사용자 조회
            User user;
            try {
                user = userRepository.findByUserId(userId).orElse(null);
                if (user == null) {
                    log.warn("DB에서 해당 사용자(userId={})를 찾을 수 없습니다.", userId);
                    return null;
                }
            } catch (Exception e) {
                log.error("DB 사용자 조회 중 에러 발생: {}", e.getMessage(), e);
                return null;
            }

            // User 엔티티에 권한 정보가 있다고 가정
            List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            // UserDetails 생성
            UserDetails userDetails = new CustomUserDetails(user);

            // 최종 Authentication 객체 생성
            return new UsernamePasswordAuthenticationToken(
                    userDetails,    // 주체(Principal)
                    null,           // 자격 증명(Credentials) - JWT라 별도 없음
                    authorities     // 권한 목록
            );

        } catch (ExpiredJwtException ex) {
            log.warn("만료된 JWT 토큰입니다: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.warn("지원되지 않는 JWT 토큰입니다: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.warn("손상된 JWT 토큰입니다: {}", ex.getMessage());
        } catch (SecurityException | IllegalStateException ex) {
            log.warn("JWT 서명 검증 실패: {}", ex.getMessage());
        } catch (JwtException ex) {
            log.warn("JWT 처리 중 예외 발생: {}", ex.getMessage());
        }

        // 모든 예외 상황에서 null 반환 → 인증 실패로 간주
        return null;
    }

    /**
     * 토큰 유효성 검사
     * - 만료기간이 넘었는지?
     * @param jwt
     * @return
     * ⭕ true     : 유효
     * ❌ false    : 만료
     */
    public boolean validateToken(String jwt) {

        try {
            // 🔐➡👩‍💼 JWT 파싱
            Jws<Claims> parsedToken = Jwts.parser()
                    .verifyWith(getShaKey())
                    .build()
                    .parseSignedClaims(jwt);

            log.info("##### 토큰 만료기간 #####");
            log.info("-> " + parsedToken.getPayload().getExpiration());

            Date exp = parsedToken.getPayload().getExpiration();

            // 만료시간과 현재시간 비교
            // 2023.12.01 vs 2023.12.14  --> 만료  : true  --->  false
            // 2023.12.30 vs 2023.12.14  --> 유효  : false --->  true
            return !exp.before(new Date());

        } catch (ExpiredJwtException exception) {
            log.error("Token Expired");                 // 토큰 만료
            return false;
        } catch (JwtException exception) {
            log.error("Token Tampered");                // 토큰 손상
            return false;
        } catch (NullPointerException exception) {
            log.error("Token is null");                 // 토큰 없음
            return false;
        } catch (Exception e) {
            return false;
        }


    }

    // secretKey ➡ signingKey
    private byte[] getSigningKey() {
        return jwtProps.getSecretKey().getBytes();
    }

    // secretKey ➡ (HMAC-SHA algorithms) ➡ signingKey
    private SecretKey getShaKey() {
        return Keys.hmacShaKeyFor(getSigningKey());
    }

}