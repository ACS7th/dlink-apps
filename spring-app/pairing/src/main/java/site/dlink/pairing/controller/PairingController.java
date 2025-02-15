package site.dlink.pairing.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import site.dlink.pairing.dto.WinePairingRequest;
import site.dlink.pairing.dto.YangjuPairingRequest;
import site.dlink.pairing.service.PairingService;

@RestController
@RequestMapping("/api/v1/pairing")
@RequiredArgsConstructor
public class PairingController {

    private final PairingService pairingService;

    @Operation(summary = "와인 안주 추천", description = "와인 정보와 카테고리를 입력받아 추천 안주를 제공합니다.")
    @PostMapping(value = "/wine")
    public JsonNode getWinePairing(
            @Parameter(description = "와인 한글명") @RequestParam("korName") String korName,
            @Parameter(description = "와인 영문명") @RequestParam("engName") String engName,
            @Parameter(description = "와인 당도") @RequestParam("sweetness") String sweetness,
            @Parameter(description = "와인 산도") @RequestParam("acidity") String acidity,
            @Parameter(description = "와인 바디") @RequestParam("body") String body,
            @Parameter(description = "와인 타닌") @RequestParam("tanin") String tanin,
            @Parameter(description = "와인 푸드 페어링 정보") @RequestParam("foodPairing") String foodPairing,
            @Parameter(description = "와인 상세 설명") @RequestParam("details") String details,
            @Parameter(description = "추천받을 안주 카테고리(seafood, beef 등)") @RequestParam("category") String category) {
        WinePairingRequest request = new WinePairingRequest(
                korName, engName, sweetness, acidity, body, tanin, foodPairing, details, category);
        return pairingService.getWinePairingRecommendation(request);
    }

    @Operation(summary = "양주 안주 추천", description = "양주 정보와 카테고리를 입력받아 추천 안주를 제공합니다.")
    @PostMapping(value = "/yangju")
    public JsonNode getYangjuPairing(
            @Parameter(description = "양주 한글명") @RequestParam("korName") String korName,
            @Parameter(description = "양주 영문명") @RequestParam("engName") String engName,
            @Parameter(description = "원산지") @RequestParam("origin") String origin,
            @Parameter(description = "도수") @RequestParam("percent") String percent,
            @Parameter(description = "용량") @RequestParam("volume") String volume,
            @Parameter(description = "가격") @RequestParam("price") String price,
            @Parameter(description = "양주 설명") @RequestParam("explanation") String explanation,
            @Parameter(description = "추천받을 안주 카테고리(seafood, beef 등)") @RequestParam("category") String category) {
        YangjuPairingRequest request = new YangjuPairingRequest(
                korName, engName, origin, percent, volume, price, explanation, category);
        return pairingService.getYangjuPairingRecommendation(request);
    }
}
