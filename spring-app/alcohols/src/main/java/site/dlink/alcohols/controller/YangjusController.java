package site.dlink.alcohols.controller;


import lombok.RequiredArgsConstructor;
import site.dlink.alcohols.entity.Yangju;
import site.dlink.alcohols.service.YangjuService;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class YangjusController {

    private final YangjuService alcoholService;

    @GetMapping("/yangjus")
    public Page<Yangju> getAllAlcohols(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return alcoholService.findAllYangjus(page, size);
    }

    @GetMapping("/yangjus/search")
    public Page<Yangju> searchAlcohols(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return alcoholService.searchYangjusByKeyword(keyword, page, size);
    }
}