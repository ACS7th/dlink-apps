package site.dlink.common.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import site.dlink.common.dto.JoinDto;
import site.dlink.common.dto.LoginDto;
import site.dlink.common.entity.User;
import site.dlink.common.service.AuthService;
import site.dlink.common.service.UserInfoService;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;




@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final UserInfoService userInfoService;

    public AuthController(AuthService authService, UserInfoService userInfoService) {
        this.authService = authService;
        this.userInfoService = userInfoService;
    }

    @GetMapping("/info")
    public ResponseEntity<?> getMethodName() {
        return ResponseEntity.ok(userInfoService.getAllUsers());
    }
    

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody @Valid JoinDto joinDto) {
        return ResponseEntity.ok(authService.join(joinDto));
    }

    @PutMapping("/update")
    public User putMethodName(@RequestBody User user) {
        return authService.update(user);
    }
    
}
