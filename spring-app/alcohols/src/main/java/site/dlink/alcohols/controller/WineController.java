package site.dlink.alcohols.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import site.dlink.alcohols.document.es.WineEs;
import site.dlink.alcohols.document.mongodb.WineMongo;
import site.dlink.alcohols.service.WineService;

@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class WineController {

    private final WineService wineService;

    @GetMapping("/wines")
    public Page<WineEs> getAllWines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return wineService.findAllWines(page, size);
    }

    @GetMapping("/wines/search")
    public Page<WineEs> searchWines(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return wineService.searchWinesByKeyword(keyword, page, size);
    }

    @GetMapping("/wine/{id}")
    public WineMongo getWineById(@PathVariable String id) {
        return wineService.findById(id);
    }

}
