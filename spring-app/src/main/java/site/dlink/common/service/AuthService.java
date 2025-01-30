package site.dlink.common.service;

import java.util.Collections;
import java.util.HashMap;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.dlink.common.dto.JoinDto;
import site.dlink.common.dto.SocialLoginRequest;
import site.dlink.common.entity.User;
import site.dlink.common.repository.UserRepository;
import site.dlink.common.security.jwt.provider.JwtTokenProvider;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public User join(JoinDto joinDto) {

        joinDto.setPassword(passwordEncoder.encode(joinDto.getPassword()));
        User newUser = modelMapper.map(joinDto, User.class);
        return userRepository.save(newUser);
    }

    public User joinBySocial(String email, String name, String image, String provider) {

        User user = User.builder()
                .email(email)
                .name(name)
                .profileImageUri(image)
                .authProvider(provider)
                .password("")
                .roles(Collections.singletonList("ROLE_USER"))
                .build();

        return userRepository.save(user);
    }

    public String loginBySocial(SocialLoginRequest request) {
        // 1) TODO 소셜 AccessToken 검증 로직
        // 예) Google Tokeninfo, Kakao user info, Naver user info ...

        // 2) 유저 조회 후, 없으면 바로 회원가입
        User user = userService.findByEmail(request.getEmail())
                                .orElseGet(() -> joinBySocial(
                                        request.getEmail(),
                                        request.getName(),
                                        request.getImage(),
                                        request.getProvider()));

        // 3) JWT 발급
        return jwtTokenProvider.createToken(
                user.getUserId(),
                user.getEmail(),
                user.getRoles());
    }

}