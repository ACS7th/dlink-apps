package site.dlink.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Auth Service API", version = "v1"))
public class SwaggerConfig {
    @Bean
    public OpenAPI authOpenAPI() {
        return new OpenAPI()
            .addServersItem(new Server().url("/api/v1/auth"));
    }
}

