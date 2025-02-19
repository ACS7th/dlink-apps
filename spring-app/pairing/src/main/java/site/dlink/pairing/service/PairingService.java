package site.dlink.pairing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import site.dlink.pairing.dto.WinePairingRequest;
import site.dlink.pairing.dto.YangjuPairingRequest;

@Service
@Slf4j
public class PairingService {

    private final ObjectMapper objectMapper;
    private final ChatClient chatClient;

    public PairingService(ChatClient.Builder builder, ObjectMapper objectMapper) {
        this.chatClient = builder.build();
        this.objectMapper = objectMapper;
    }

    /**
     * 와인용 안주 추천
     */
    public JsonNode getWinePairingRecommendation(WinePairingRequest req) {
        try {
            // 1) 프롬프트 생성 (모든 필드 활용)
            String prompt = createWinePrompt(req);

            // 2) Bedrock 모델 호출
            String rawResponse = chatClient.prompt(prompt).call().content();
            log.info("Bedrock raw response (Wine): {}", rawResponse);

            // 3) JSON 변환 후 반환
            return objectMapper.readTree(rawResponse);
        } catch (Exception e) {
            log.error("Bedrock 모델 호출 중 오류 발생 (Wine)", e);
            throw new RuntimeException("Bedrock 모델 호출 실패 (Wine)", e);
        }
    }

    /**
     * 양주용 안주 추천
     */
    public JsonNode getYangjuPairingRecommendation(YangjuPairingRequest req) {
        try {
            // 1) 프롬프트 생성 (모든 필드 활용)
            String prompt = createYangjuPrompt(req);

            // 2) Bedrock 모델 호출
            String rawResponse = chatClient.prompt(prompt).call().content();
            log.info("Bedrock raw response (Yangju): {}", rawResponse);

            // 3) JSON 변환 후 반환
            return objectMapper.readTree(rawResponse);
        } catch (Exception e) {
            log.error("Bedrock 모델 호출 중 오류 발생 (Yangju)", e);
            throw new RuntimeException("Bedrock 모델 호출 실패 (Yangju)", e);
        }
    }

    /**
     * 와인용 프롬프트
     * - 재료(ingredients)는 제외
     * - side_dish(곁들임 추천) 추가
     */
    private String createWinePrompt(WinePairingRequest req) {
        return String.format("""
                ### Instruction:
                이 와인은 '%s' (영문명: %s)입니다.
                - 당도: %s
                - 산도: %s
                - 바디감: %s
                - 타닌: %s

                추가 정보:
                - foodPairing: %s
                - details: %s

                이 와인은 '%s' 카테고리에 해당하는 안주를 추천해 주세요.
                **안주는 반드시 JSON 형식**으로 출력하세요.

                JSON 형식 규칙:
                1) 키는 **영어**만 사용 (예: dish_name, side_dish, description).
                2) 필수 필드: dish_name, side_dish, description
                3) side_dish는 **리스트(List) 형태**로 곁들임 메뉴를 표기
                4) 값은 한글로 표시
                5) 절대 JSON 형식을 깨뜨리지 말 것
                6) 예시와 같은 구조를 유지하고, 그 외 설명은 쓰지 않기

                예시 JSON:
                {
                  "dish_name": "트러플 파스타",
                  "side_dish": ["마늘 바게트", "파르미지아노 치즈", "트러플 오일"],
                  "description": "고소한 트러플 향의 파스타는 와인의 깊은 풍미를 더욱 풍부하게 만들어 줍니다."
                }

                ### Response:
                """,
                req.getKorName(),
                req.getEngName(),
                req.getSweetness(),
                req.getAcidity(),
                req.getBody(),
                req.getTanin(),
                req.getFoodPairing(),
                req.getDetails(),
                req.getCategory());
    }

    /**
     * 양주용 프롬프트
     * - 재료(ingredients)는 제외
     * - side_dish(곁들임 추천) 추가
     */
    private String createYangjuPrompt(YangjuPairingRequest req) {
        return String.format("""
                ### Instruction:
                이 양주는 '%s' (영문명: %s)입니다.
                - 원산지: %s
                - 도수: %s도
                - 용량: %s ml
                - 가격: %s원

                추가 정보:
                - explanation: %s

                이 양주는 '%s' 카테고리에 해당하는 안주를 추천해 주세요.
                **안주는 반드시 JSON 형식**으로 출력하세요.

                JSON 형식 규칙:
                1) 키는 **영어**만 사용 (예: dish_name, side_dish, description).
                2) 필수 필드: dish_name, side_dish, description
                3) side_dish는 **리스트(List) 형태**로 곁들임 메뉴를 표기
                4) 모든 값은 한글로 표시해야 하며, 영어는 절대 포함하지 마세요.
                5) JSON 형식 외의 추가적인 설명은 절대 출력하지 마세요.
                6) 모든 텍스트는 UTF-8로 인코딩되어야 합니다.
                7) 절대 JSON 형식을 깨뜨리지 말 것
                8) 예시와 같은 구조를 유지하고, 그 외 설명은 쓰지 않기
                9) description은 60자 근처로 길게 대답
                10) explanation을 활용한 description 작성

                예시 JSON:
                {
                  "dish_name": "감바스 알 아히요",
                  "side_dish": ["버터 바게트", "레몬 웨지", "올리브"],
                  "description": "매콤한 감바스 알 아히요는 양주의 강한 도수와 깔끔한 맛을 부드럽게 중화시켜 줍니다."
                }

                ### Response:
                """,
                req.getKorName(),
                req.getEngName(),
                req.getOrigin(),
                req.getPercent(),
                req.getVolume(),
                req.getPrice(),
                req.getExplanation(),
                req.getCategory());
    }

}
