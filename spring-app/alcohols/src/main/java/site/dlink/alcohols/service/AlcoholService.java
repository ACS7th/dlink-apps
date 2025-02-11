package site.dlink.alcohols.service;

import lombok.RequiredArgsConstructor;
import site.dlink.alcohols.entity.Alcohol;
import site.dlink.alcohols.repository.AlcoholRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlcoholService {

    private final AlcoholRepository alcoholRepository;

    public Page<Alcohol> getAlcoholsByPage(int page, int size) {
        return alcoholRepository.findAll(PageRequest.of(page, size));
    }

    public Page<Alcohol> searchAlcoholsByPage(String keyword, int page, int size) {
        return alcoholRepository.findByKorNameContaining(keyword, PageRequest.of(page, size));
    }
}
