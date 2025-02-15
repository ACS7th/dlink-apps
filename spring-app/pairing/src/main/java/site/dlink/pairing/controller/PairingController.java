package site.dlink.pairing.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import site.dlink.pairing.dto.WinePairingRequest;
import site.dlink.pairing.dto.YangjuPairingRequest;
import site.dlink.pairing.service.PairingService;

@Tag(name = "Pairing API", description = "와인 및 양주에 대한 안주 추천 API")
@RestController
@RequestMapping("/api/v1/pairing")
@RequiredArgsConstructor
public class PairingController {

    private final PairingService pairingService;

    /**
     * (1) 와인 안주 추천
     */
    @Operation(
            summary = "와인 안주 추천",
            description = "와인 정보와 카테고리를 입력받아 추천 안주를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "추천 안주 반환 성공",
                            content = @Content(schema = @Schema(implementation = JsonNode.class))),
                    @ApiResponse(responseCode = "400", description = "요청 파라미터 오류", content = @Content),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @PostMapping(value = "/wine")
    public JsonNode getWinePairing(
            @Parameter(description = "와인 한글명", example = "샤또 마고")
            @RequestParam("korName") String korName,
            @Parameter(description = "와인 영문명", example = "Chateau Margaux")
            @RequestParam("engName") String engName,
            @Parameter(description = "와인 당도 (1~5)", example = "3")
            @RequestParam("sweetness") String sweetness,
            @Parameter(description = "와인 산도 (1~5)", example = "4")
            @RequestParam("acidity") String acidity,
            @Parameter(description = "와인 바디 (1~5)", example = "5")
            @RequestParam("body") String body,
            @Parameter(description = "와인 타닌 (1~5)", example = "4")
            @RequestParam("tanin") String tanin,
            @Parameter(description = "와인 푸드 페어링 정보", example = "스테이크, 치즈")
            @RequestParam("foodPairing") String foodPairing,
            @Parameter(description = "와인 상세 설명", example = "부드럽고 깊은 풍미의 와인")
            @RequestParam("details") String details,
            @Parameter(description = "추천받을 안주 카테고리 (seafood, beef, snack 등)", required = true, example = "beef")
            @RequestParam("category") String category) {
        WinePairingRequest request = new WinePairingRequest(
                korName, engName, sweetness, acidity, body, tanin, foodPairing, details, category);
        return pairingService.getWinePairingRecommendation(request);
    }

    /**
     * (2) 양주 안주 추천
     */
    @Operation(
            summary = "양주 안주 추천",
            description = "양주 정보와 카테고리를 입력받아 추천 안주를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "추천 안주 반환 성공",
                            content = @Content(schema = @Schema(implementation = JsonNode.class))),
                    @ApiResponse(responseCode = "400", description = "요청 파라미터 오류", content = @Content),
                    @ApiResponse(responseCode = "500", description = "서버 내부 오류", content = @Content)
            }
    )
    @PostMapping(value = "/yangju")
    public JsonNode getYangjuPairing(
            @Parameter(description = "양주 한글명", example = "발렌타인 21년")
            @RequestParam("korName") String korName,
            @Parameter(description = "양주 영문명", example = "Ballantine's 21")
            @RequestParam("engName") String engName,
            @Parameter(description = "원산지", example = "Scotland")
            @RequestParam("origin") String origin,
            @Parameter(description = "도수 (%)", example = "40")
            @RequestParam("percent") String percent,
            @Parameter(description = "용량 (ml)", example = "700")
            @RequestParam("volume") String volume,
            @Parameter(description = "가격 (KRW)", example = "120000")
            @RequestParam("price") String price,
            @Parameter(description = "양주 설명", example = "부드럽고 스모키한 향")
            @RequestParam("explanation") String explanation,
            @Parameter(description = "추천받을 안주 카테고리 (seafood, beef, snack 등)", required = true, example = "snack")
            @RequestParam("category") String category) {
        YangjuPairingRequest request = new YangjuPairingRequest(
                korName, engName, origin, percent, volume, price, explanation, category);
        return pairingService.getYangjuPairingRecommendation(request);
    }
}
