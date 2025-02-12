package site.dlink.alcohols.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import site.dlink.alcohols.entity.Wine;
import site.dlink.alcohols.service.WineService;

@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class WineController {

    private final WineService wineService;

    @GetMapping("/wines")
    public Page<Wine> getAllWines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return wineService.findAllWines(page, size);
    }

    @GetMapping("/wines/search")
    public Page<Wine> searchWines(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return wineService.searchWinesByKeyword(keyword, page, size);
    }

}
