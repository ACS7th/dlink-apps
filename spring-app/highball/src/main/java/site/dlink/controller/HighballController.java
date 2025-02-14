package site.dlink.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import site.dlink.document.Highball;
import site.dlink.enums.HighballCateEnum;
import site.dlink.service.HighballService;

@RestController
@RequestMapping("/api/v1/highball")
@RequiredArgsConstructor
public class HighballController {
    
    private final HighballService highballService;

    @GetMapping("/category")
    public List<Highball> findByCategory(@RequestParam HighballCateEnum category) {
        return highballService.findByCategory(category);
    }
    
}
