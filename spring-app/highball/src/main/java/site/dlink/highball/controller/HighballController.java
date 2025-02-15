package site.dlink.highball.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.dlink.highball.document.Highball;
import site.dlink.highball.enums.HighballCateEnum;
import site.dlink.highball.service.AwsS3Service;
import site.dlink.highball.service.HighballService;

@RequestMapping("/api/v1/highball")
@RestController
@RequiredArgsConstructor
@Slf4j
public class HighballController {

    private final HighballService highballService;
    private final AwsS3Service awsS3Service;

    @Operation(summary = "하이볼 레시피 등록", description = "하이볼 레시피와 이미지를 등록합니다.")
    @PostMapping(value = "/recipe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadHighballRecipe(
            @RequestParam @Parameter(description = "하이볼 레시피 작성자(email)") String writeUser,
            @RequestParam @Parameter(description = "하이볼 레시피 이름") String korName,
            @RequestParam(required = false) String engName,
            @RequestParam @Parameter(description = "하이볼 카테고리(wine, liquor, cocktail...)") HighballCateEnum category,
            @RequestParam @Parameter(description = "하이볼 만드는 방법") String making,
            @RequestPart(required = false) MultipartFile imageFile,
            @RequestPart(required = false) @Parameter(description = "하이볼 재료 (JSON String)") String ingredients) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> ingredientsMap = new HashMap<>();
            if (ingredients != null && !ingredients.isBlank()) {
                try {
                    ingredientsMap = objectMapper.readValue(ingredients, new TypeReference<Map<String, String>>() {
                    });
                } catch (Exception e) {
                    log.error("재료 JSON 파싱 실패", e);
                    return ResponseEntity.status(400).body("재료 형식이 잘못되었습니다.");
                }
            }

            // 🟡 이미지 업로드
            Map<String, String> uploadResultMap = Optional.ofNullable(
                    awsS3Service.uploadFile(imageFile)).orElseGet(HashMap::new);

            // 🟡 Highball 객체 생성
            Highball highball = Highball.builder()
                    .engName(Optional.ofNullable(engName).orElse("Unknown"))
                    .korName(korName)
                    .category(category)
                    .making(making)
                    .ingredients(ingredientsMap) // JSON으로 받은 재료 저장
                    .imageFilename(uploadResultMap.getOrDefault("fileName", ""))
                    .imageUrl(uploadResultMap.getOrDefault("fileUrl", ""))
                    .build();

            // 🟡 Highball 저장
            highballService.saveHighball(highball, writeUser);

            return ResponseEntity.ok(highball.getId());

        } catch (Exception e) {
            log.error("하이볼 레시피 업로드 실패", e);
            return ResponseEntity.status(500).body("업로드 실패: " + e.getMessage());
        }
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
    public Highball findById(
            @Parameter(description = "하이볼의 고유 ID", example = "67adad6a40a41a2d28e6") @PathVariable String id) {
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
