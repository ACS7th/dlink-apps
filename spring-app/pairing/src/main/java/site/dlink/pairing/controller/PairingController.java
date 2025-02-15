package site.dlink.pairing.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;

import site.dlink.common.document.mongo.WineMongo;
import site.dlink.common.document.mongo.YangjuMongo;
import site.dlink.pairing.dto.BedrockResponse;
import site.dlink.pairing.service.PairingService;

@RestController
@RequestMapping("/api/v1/pairing")
@RequiredArgsConstructor
public class PairingController {

    private final PairingService pairingService;

    @PostMapping("/wine")
    public JsonNode getWinePairing(@RequestBody WineMongo wine) {
        return pairingService.getPairingRecommendation(wine);
    }

    @PostMapping("/yangju")
    public JsonNode getYangjuPairing(@RequestBody YangjuMongo yangju) {
        return pairingService.getPairingRecommendation(yangju);
    }
}
