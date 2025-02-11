package site.dlink.alcohols.controller;


import lombok.RequiredArgsConstructor;
import site.dlink.alcohols.entity.Alcohol;
import site.dlink.alcohols.service.AlcoholService;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class AlcoholController {

    private final AlcoholService alcoholService;

    @GetMapping
    public Page<Alcohol> getAllAlcohols(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return alcoholService.getAlcoholsByPage(page, size);
    }

    @GetMapping("/search")
    public Page<Alcohol> searchAlcohols(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return alcoholService.searchAlcoholsByPage(keyword, page, size);
    }
}