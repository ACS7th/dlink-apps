package site.dlink.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.extern.slf4j.Slf4j;
import site.dlink.common.security.custom.CustomUserDetailsService;
import site.dlink.common.security.jwt.filter.JwtAuthenticationFilter;
import site.dlink.common.security.jwt.filter.JwtRequestFilter;
import site.dlink.common.security.jwt.provider.JwtTokenProvider;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@Configuration
@Slf4j
public class SecurityConfig {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenProvider jwtTokenProvider;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService, JwtTokenProvider jwtTokenProvider) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
        log.info("SecurityFilterChain 빈 생성...");

        http.csrf(csrf -> csrf.disable()); // csrf의 경우 Rest 서버에선 필요 없음
        http.httpBasic(basic -> basic.disable()); // httpbasic은 기본 autorization 헤더 사용, jwt를 위해 비활성화
        http.formLogin(login -> login.disable()); // form기반 인증 비활성화
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // jwt 사용을 위해 jsessionid 비활성화

        // 필터 설정
        http.addFilterAt(new JwtAuthenticationFilter(authenticationManager, jwtTokenProvider),UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(new JwtRequestFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        // 인증 설정
        http.userDetailsService(customUserDetailsService);
        
        // 인가 설정
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/api/test/**").permitAll()
                .anyRequest().authenticated());

        // 로그아웃 설정
        http.logout(logout -> logout.logoutUrl("/logout")
                .logoutSuccessHandler((req, res, auth) -> {
                    log.info("로그아웃...");
                    res.setStatus(HttpStatus.OK.value());
                })
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll());
        
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        log.info("AuthenticationManager 빈 생성...");
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        log.info("PasswordEncoder 빈 생성...");
        return new BCryptPasswordEncoder();
    }
}
