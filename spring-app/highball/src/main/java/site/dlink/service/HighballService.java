package site.dlink.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.dlink.document.Highball;
import site.dlink.enums.HighballCateEnum;
import site.dlink.repository.HighballRepository;

@Service
@RequiredArgsConstructor
public class HighballService {
    private final HighballRepository highballRepository;

    public List<Highball> findByCategory(HighballCateEnum category) {
        return highballRepository.findByCategory(category);
    }
    
    
}