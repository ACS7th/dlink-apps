package site.dlink.common.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import site.dlink.common.dto.JoinDto;
import site.dlink.common.dto.SocialLoginRequest;
import site.dlink.common.service.AuthService;
import site.dlink.common.service.UserService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getMethodName() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 회원 가입
    @PostMapping("/user")
    public ResponseEntity<?> join(@RequestBody @Valid JoinDto joinDto) {
        log.info("가입 요청: email={}, name={}", joinDto.getEmail(), joinDto.getName());
        return ResponseEntity.ok(authService.join(joinDto));
    }

    // 회원 정보 수정
    @PutMapping("/user")
    public ResponseEntity<?> updateUser(@RequestBody @Valid JoinDto joinDto) {
        log.info("회원 정보 수정 요청: email={}, name={}", joinDto.getEmail(), joinDto.getName());
        return ResponseEntity.ok(authService.updateUser(joinDto));
    }
    

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody SocialLoginRequest request) {
        log.info("소셜 로그인 요청: provider={}, email={}", request.getProvider(), request.getEmail());

        try {
            Map<String, String> result = new HashMap<>();
            result.put("jwt", authService.loginBySocial(request));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("소셜 로그인 처리 오류", e);
            return ResponseEntity.badRequest().body("소셜 로그인 실패");
        }
    }

}
