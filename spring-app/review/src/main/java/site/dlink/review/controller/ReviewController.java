package site.dlink.review.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.dlink.review.service.ReviewService;

import java.util.List;
import java.util.Map;

@Tag(name = "Review API", description = "술(와인/양주) 리뷰 관리 API")
@RestController
@RequestMapping("/api/v1/review/{category}/{drinkId}")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 1) 전체 리뷰 조회
     */
    @Operation(
            summary = "전체 리뷰 조회",
            description = "특정 카테고리와 음료(drinkId)에 대한 전체 리뷰 목록을 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 목록 조회 성공"),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllReviews(
            @Parameter(description = "술 카테고리 (예: wine, whiskey, rum 등)", required = true) @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true) @PathVariable String drinkId) {
        List<Map<String, Object>> reviews = reviewService.getAllReviews(category, drinkId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * 2) 특정 리뷰 조회 (인덱스 기반)
     */
    @Operation(
            summary = "특정 리뷰 조회",
            description = "특정 카테고리 및 음료(drinkId)의 특정 인덱스 리뷰를 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 조회 성공"),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @GetMapping("/{reviewIndex}")
    public ResponseEntity<Map<String, Object>> getReview(
            @Parameter(description = "술 카테고리 (예: wine, vodka 등)", required = true) @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true) @PathVariable String drinkId,
            @Parameter(description = "리뷰 인덱스 (0부터 시작)", required = true) @PathVariable int reviewIndex) {
        Map<String, Object> review = reviewService.getReview(category, drinkId, reviewIndex);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(review);
    }

    /**
     * 3) 새 리뷰 추가
     */
    @Operation(
            summary = "새 리뷰 추가",
            description = "특정 카테고리 및 음료(drinkId)에 새 리뷰를 추가합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 추가 성공", 
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "음료를 찾을 수 없음", content = @Content)
            }
    )
    @PostMapping
    public ResponseEntity<Document> createReview(
            @Parameter(description = "술 카테고리 (예: wine, whiskey)", required = true) @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true) @PathVariable String drinkId,
            @RequestBody Map<String, Object> newReview) {
        Document updatedDoc = reviewService.createReview(category, drinkId, newReview);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }

    /**
     * 4) 리뷰 수정
     */
    @Operation(
            summary = "리뷰 수정",
            description = "특정 카테고리 및 음료(drinkId)의 특정 인덱스 리뷰를 수정합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 수정 성공",
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @PutMapping("/{reviewIndex}")
    public ResponseEntity<Document> updateReview(
            @Parameter(description = "술 카테고리 (예: wine, whiskey 등)", required = true) @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true) @PathVariable String drinkId,
            @Parameter(description = "수정할 리뷰 인덱스 (0부터 시작)", required = true) @PathVariable int reviewIndex,
            @RequestBody Map<String, Object> requestData) {
        Document updatedDoc = reviewService.updateReview(category, drinkId, reviewIndex, requestData);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }

    /**
     * 5) 리뷰 삭제
     */
    @Operation(
            summary = "리뷰 삭제",
            description = "특정 카테고리 및 음료(drinkId)의 특정 인덱스 리뷰를 삭제합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공",
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @DeleteMapping("/{reviewIndex}")
    public ResponseEntity<Document> deleteReview(
            @Parameter(description = "술 카테고리 (예: wine, whiskey)", required = true) @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true) @PathVariable String drinkId,
            @Parameter(description = "삭제할 리뷰 인덱스", required = true) @PathVariable int reviewIndex) {
        Document updatedDoc = reviewService.deleteReview(category, drinkId, reviewIndex);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }
}
