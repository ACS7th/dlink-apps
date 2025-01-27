package site.dlink.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Component
@Slf4j
public class MySQLInitLogger {

    @Value("${spring.datasource.url:no_input_mysqlurl}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:no_input_username}")
    private String username;

    @Value("${spring.datasource.password:no_input_password}")
    private String password;

    @PostConstruct
    public void initLogger() {
        int count = 0;
        boolean connectionSuccessful = false;

        while (count < 10 && !connectionSuccessful) {
            log.info("### Database Configuration ###");
            log.info("MySQL URL: {}", mysqlUrl);
            log.info("Execution count: {}", count + 1);
            log.info("#################################");

            try (Connection connection = DriverManager.getConnection(mysqlUrl, username, password)) {
                if (connection != null && !connection.isClosed()) {
                    log.info("MySQL 연결 성공");
                    connectionSuccessful = true;
                }
            } catch (SQLException e) {
                log.error("MySQL 연결 실패: {}", e.getMessage());
            }

            if (!connectionSuccessful) {
                count++;
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.error("스레드 인터럽트 발생: {}", e.getMessage());
                }
            }
        }

        if (!connectionSuccessful) {
            log.error("MySQL 연결 실패: 최대 재시도 횟수 초과");
        }
    }
}