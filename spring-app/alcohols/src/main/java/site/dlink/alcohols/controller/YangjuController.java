package site.dlink.alcohols.controller;


import lombok.RequiredArgsConstructor;
import site.dlink.alcohols.document.es.YangjuEs;
import site.dlink.alcohols.service.YangjuService;

import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class YangjuController {

    private final YangjuService yangjuService;

    @GetMapping("/yangjus")
    public Page<YangjuEs> getAllAlcohols(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return yangjuService.findAllYangjus(page, size);
    }

    @GetMapping("/yangjus/search")
    public Page<YangjuEs> searchAlcohols(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return yangjuService.searchYangjusByKeyword(keyword, page, size);
    }
    
}