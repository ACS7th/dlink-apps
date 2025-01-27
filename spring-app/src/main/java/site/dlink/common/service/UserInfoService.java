package site.dlink.common.service;

import java.util.List;

import org.springframework.stereotype.Service;

import site.dlink.common.entity.User;
import site.dlink.common.repository.UserRepository;

@Service
public class UserInfoService {
    private final UserRepository userRepository;

    public UserInfoService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
