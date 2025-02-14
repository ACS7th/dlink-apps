package site.dlink.apiGateway.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import site.dlink.apiGateway.validator.JwtValidator;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtGlobalFilter implements GlobalFilter, Ordered {

    private final JwtValidator jwtValidator;

    private static final List<String> EXCLUDED_PATHS = List.of(
            "/api/v1/alcohols/",
            "/api/v1/review/",
            "/api/v1/highball/"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        if (EXCLUDED_PATHS.stream().anyMatch(path::startsWith)) {
            log.info("🔓 JWT 검증 제외 경로: {}", path);
            return chain.filter(exchange);
        }

        log.info("🔐 JWT 검증 필터 실행 ...");
        String header = request.getHeaders().getFirst("Authorization");

        if (header == null) {
            log.info("❌ 토큰 없음");
            return chain.filter(exchange);
        }

        if (!header.startsWith("Bearer ")) {
            log.info("❌ 잘못된 형식의 JWT");
            return chain.filter(exchange);
        }

        String jwt = header.replace("Bearer ", "");

        if (!jwtValidator.validateToken(jwt)) {
            log.info("❌ JWT 검증 실패");
            return chain.filter(exchange);
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
