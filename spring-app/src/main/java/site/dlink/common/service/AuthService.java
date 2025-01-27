package site.dlink.common.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import site.dlink.common.dto.JoinDto;
import site.dlink.common.entity.User;
import site.dlink.common.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;
    }
    
    public User join(JoinDto joinDto) {
        joinDto.setPassword(passwordEncoder.encode(joinDto.getPassword()));
        User newUser = modelMapper.map(joinDto, User.class);
        return userRepository.save(newUser);
    }

    public User update(User user) {
        if (user == null || user.getUserId() == null) {
            throw new IllegalArgumentException("유효하지 않은 사용자입니다.");
        }
    
        if (!userRepository.existsById(user.getUserId())) {
            throw new UsernameNotFoundException("유저가 없습니다.");
        }
    
        return userRepository.save(user);
    }
    
}