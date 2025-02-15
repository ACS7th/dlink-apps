package site.dlink.pairing.controller;

import lombok.RequiredArgsConstructor;
import site.dlink.pairing.service.YoutubeSearchService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pairing")
@RequiredArgsConstructor
public class YoutubeSearchController {

    private final YoutubeSearchService youtubeSearchService;

    @GetMapping("/shorts/search")
    public ResponseEntity<String> getShortsLink(@RequestParam String dish) {
        try {
            String shortsLink = youtubeSearchService.getShortsLink(dish);
            return ResponseEntity.ok(shortsLink);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
