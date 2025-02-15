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
import site.dlink.review.dto.ReviewRequest;
import site.dlink.review.service.ReviewService;

import java.util.Map;

@Tag(name = "Review API", description = "술(와인/양주) 리뷰 관리 API")
@RestController
@RequestMapping("/api/v1/review/{category}/{drinkId}")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * (1) 전체 리뷰 조회
     */
    @Operation(
            summary = "전체 리뷰 조회",
            description = "특정 카테고리와 음료(drinkId)에 대한 전체 리뷰(Map<이메일, {rating, content}>)를 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 목록 조회 성공"),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllReviews(
            @Parameter(description = "술 카테고리 (예: gin, whiskey, wine 등)", required = true)
            @PathVariable String category,
            @Parameter(description = "음료의 ID (MongoDB ObjectId)", required = true)
            @PathVariable String drinkId
    ) {
        Map<String, Object> reviews = reviewService.getAllReviews(category, drinkId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * (2) 특정 이메일 리뷰 조회
     */
    @Operation(
            summary = "특정 이메일 리뷰 조회",
            description = "특정 카테고리 및 음료(drinkId)에 대해, 해당 이메일의 리뷰를 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 조회 성공"),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @GetMapping("/{email}")
    public ResponseEntity<Map<String, Object>> getReviewByEmail(
            @PathVariable String category,
            @PathVariable String drinkId,
            @PathVariable String email
    ) {
        Map<String, Object> reviewData = reviewService.getReviewByEmail(category, drinkId, email);
        if (reviewData == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reviewData);
    }

    /**
     * (3) 새 리뷰 추가
     *  - email 파라미터 + ReviewRequest(rating, content) Body
     */
    @Operation(
            summary = "새 리뷰 추가",
            description = "특정 카테고리와 음료에 대해, 이메일(key) → {rating, content}(value)를 'reviews'에 추가합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 추가 성공",
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "음료를 찾을 수 없음", content = @Content)
            }
    )
    @PostMapping("/{email}")
    public ResponseEntity<Document> createReview(
            @PathVariable String category,
            @PathVariable String drinkId,
            @PathVariable String email,
            @RequestBody ReviewRequest reviewBody
    ) {
        Document updatedDoc = reviewService.createReview(category, drinkId, email, reviewBody);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }

    /**
     * (4) 리뷰 수정 (이메일 기반)
     */
    @Operation(
            summary = "리뷰 수정 (이메일 기반)",
            description = "특정 카테고리 및 음료(drinkId)의 특정 이메일 리뷰를 수정합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 수정 성공",
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @PutMapping("/{email}")
    public ResponseEntity<Document> updateReviewByEmail(
            @PathVariable String category,
            @PathVariable String drinkId,
            @PathVariable String email,
            @RequestBody ReviewRequest request
    ) {
        Document updatedDoc = reviewService.updateReviewByEmail(category, drinkId, email, request);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }

    /**
     * (5) 리뷰 삭제 (이메일 기반)
     */
    @Operation(
            summary = "리뷰 삭제 (이메일 기반)",
            description = "특정 카테고리 및 음료(drinkId)의 특정 이메일 리뷰를 삭제합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공",
                            content = @Content(schema = @Schema(implementation = Document.class))),
                    @ApiResponse(responseCode = "404", description = "리뷰 또는 음료를 찾을 수 없음", content = @Content)
            }
    )
    @DeleteMapping("/{email}")
    public ResponseEntity<Document> deleteReviewByEmail(
            @PathVariable String category,
            @PathVariable String drinkId,
            @PathVariable String email
    ) {
        Document updatedDoc = reviewService.deleteReviewByEmail(category, drinkId, email);
        if (updatedDoc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedDoc);
    }
}
