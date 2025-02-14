package site.dlink.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import site.dlink.document.Highball;
import site.dlink.enums.HighballCateEnum;
import site.dlink.service.AwsS3Service;
import site.dlink.service.HighballService;

@RestController
@RequestMapping("/api/v1/highball")
@RequiredArgsConstructor
public class HighballController {

    private final HighballService highballService;
    private final AwsS3Service awsS3Service;

    @Operation(summary = "하이볼 레시피 업로드", description = "하이볼 레시피와 이미지를 업로드합니다.")
    @PostMapping(value = "/recipe", consumes = {"multipart/form-data"})
    public ResponseEntity<String> uploadHighballRecipe(
            @Parameter(description = "영문 이름 (Optional)", required = false) @RequestParam(required = false) String engName,
            @Parameter(description = "한글 이름", required = true) @RequestParam(required = true) String korName,
            @Parameter(description = "카테고리 (ENUM)", required = true) @RequestParam(required = true) HighballCateEnum category,
            @Parameter(description = "제조법", required = true) @RequestParam(required = true) String making,
            @Parameter(description = "이미지 파일 (Multipart)" , required = false) @RequestParam(required = false) MultipartFile imageFile) {

        Map<String, String> uploadResultMap = awsS3Service.uploadFile(imageFile);

        Highball highball = Highball.builder()
                .engName(engName)
                .korName(korName)
                .category(category)
                .making(making)
                .imageFilename(uploadResultMap.get("fileName"))
                .imageUrl(uploadResultMap.get("fileUrl"))
                .build();
        highballService.saveHighball(highball);
        return ResponseEntity.ok("레시피 업로드 성공: " + highball.getId());
    }

    @Operation(summary = "하이볼 레시피 삭제", description = "하이볼 레시피와 이미지를 삭제합니다.")
    @DeleteMapping("/recipe/{id}")
    public ResponseEntity<String> deleteHighballRecipe(
            @Parameter(description = "삭제할 하이볼 레시피의 ID", required = true) @PathVariable String id) {
        Highball highball = highballService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("레시피를 찾을 수 없습니다: " + id));
        awsS3Service.deleteFile(highball.getImageFilename());
        highballService.deleteHighball(id);
        return ResponseEntity.ok("레시피 삭제 성공: " + id);
    }

    @Operation(summary = "id로 레시피 조회")
    @GetMapping("/{id}")
    public Highball findById(@Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") @PathVariable String id) {
        return highballService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("레시피를 찾을 수 없습니다: " + id));
    }

    @Operation(summary = "카테고리별 레시피 조회")
    @GetMapping("/category")
    public List<Highball> findByCategory(@RequestParam HighballCateEnum category) {
        return highballService.findByCategory(category);
    }

    @Operation(summary = "좋아요 토글", description = "사용자가 좋아요를 누르면 추가, 다시 누르면 취소합니다.")
    @PostMapping("/{id}/like")
    public ResponseEntity<String> toggleLike(
            @Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") @PathVariable String id,

            @Parameter(description = "사용자의 고유 Email", example = "asordk@naver.com") @RequestParam String email) {
        long likeCount = highballService.toggleLike(id, email);
        return ResponseEntity.ok("" + likeCount);
    }

    @Operation(summary = "좋아요 수 조회", description = "특정 하이볼의 현재 좋아요 수를 반환합니다.")
    @GetMapping("/{id}/like-count")
    public ResponseEntity<Long> getLikeCount(
            @Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") @PathVariable String id) {
        long likeCount = highballService.getLikeCount(id);
        return ResponseEntity.ok(likeCount);
    }
}
