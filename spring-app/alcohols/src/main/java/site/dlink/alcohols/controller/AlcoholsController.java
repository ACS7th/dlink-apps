package site.dlink.alcohols.controller;

import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import site.dlink.alcohols.service.WineService;
import site.dlink.alcohols.service.YangjuService;

@RestController
@RequestMapping("/api/v1/alcohols")
@RequiredArgsConstructor
public class AlcoholsController {

    private final YangjuService yangjuService;
    private final WineService wineService;

    @GetMapping("/{id}")
    @Operation(description = "모든 술에 대해 id를 사용하여 검색(MongoDB)")
    public ResponseEntity<?> getAlcoholById(@PathVariable String id) {
        Document yangjuDoc = yangjuService.findDocumentById(id);
        if (yangjuDoc != null) {
            return ResponseEntity.ok(yangjuDoc.toJson());
        }

        Document wineDoc = wineService.findDocumentById(id);
        if (wineDoc != null) {
            wineDoc.append("category", "wine");
            return ResponseEntity.ok(wineDoc.toJson());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("alcohol document not found");
        }

    }
    
}
