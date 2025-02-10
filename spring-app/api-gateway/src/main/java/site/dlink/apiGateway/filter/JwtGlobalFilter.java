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

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtGlobalFilter implements GlobalFilter, Ordered {

    private final JwtValidator jwtValidator;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("JWT 검증 필터 시작 ...");

        ServerHttpRequest request = exchange.getRequest();
        String header = request.getHeaders().getFirst("Authorization");

        if (header == null) {
            log.info("토큰이 없습니다");
            return chain.filter(exchange);
        }

        if (!header.startsWith("Bearer ")) {
            log.info("잘못된 형식의 JWT입니다.");
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
