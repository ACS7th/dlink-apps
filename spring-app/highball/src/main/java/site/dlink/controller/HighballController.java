package site.dlink.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import site.dlink.document.Highball;
import site.dlink.enums.HighballCateEnum;
import site.dlink.service.HighballService;

@RestController
@RequestMapping("/api/v1/highball")
@RequiredArgsConstructor
public class HighballController {

    private final HighballService highballService;

    @Operation(summary = "카테고리별 레시피 조회")
    @GetMapping("/category")
    public List<Highball> findByCategory(@RequestParam HighballCateEnum category) {
        return highballService.findByCategory(category);
    }

    @Operation(summary = "좋아요 토글", description = "사용자가 좋아요를 누르면 추가, 다시 누르면 취소합니다.")
    @PostMapping("/{id}/like")
    public ResponseEntity<String> toggleLike(
            @Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") 
            @PathVariable String id,

            @Parameter(description = "사용자의 고유 Email", example = "asordk@naver.com") 
            @RequestParam String email) {
        long likeCount = highballService.toggleLike(id, email);
        return ResponseEntity.ok("" + likeCount);
    }

    @Operation(summary = "좋아요 수 조회", description = "특정 하이볼의 현재 좋아요 수를 반환합니다.")
    @GetMapping("/{id}/like-count")
    public ResponseEntity<Long> getLikeCount(
            @Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") 
            @PathVariable String id) {
        long likeCount = highballService.getLikeCount(id);
        return ResponseEntity.ok(likeCount);
    }
}
