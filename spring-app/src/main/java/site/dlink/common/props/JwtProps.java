package site.dlink.common.props;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@Component
@ConfigurationProperties("jwt")
@Slf4j
public class JwtProps {
    private String secretKey;
}