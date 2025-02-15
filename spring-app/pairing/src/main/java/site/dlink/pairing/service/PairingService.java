package site.dlink.pairing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import site.dlink.common.document.mongo.WineMongo;
import site.dlink.common.document.mongo.YangjuMongo;
import site.dlink.pairing.dto.BedrockResponse;

@Service
@Slf4j
public class PairingService {

    private final ObjectMapper objectMapper;

    private final ChatClient chatClient;

    public PairingService(ChatClient.Builder builder, ObjectMapper objectMapper) {
        this.chatClient = builder.build();
        this.objectMapper = objectMapper;
    }

    public JsonNode getPairingRecommendation(Object alcoholData) {
        try {
            // 1) 프롬프트 구성
            String prompt = createPrompt(alcoholData);

            // 2) Bedrock 모델 호출 (ChatClient)
            String rawResponse = chatClient.prompt(prompt).call().content();
            log.info("Bedrock raw response: {}", rawResponse);

            // 3) JsonNode로 변환 (유연성 확보)
            JsonNode node = objectMapper.readTree(rawResponse);
            return node;

        } catch (Exception e) {
            log.error("Bedrock 모델 호출 중 오류 발생", e);
            throw new RuntimeException("Bedrock 모델 호출 실패", e);
        }
    }
    

    private String createPrompt(Object alcoholData) {
        if (alcoholData instanceof WineMongo wine) {
            return String.format("""
                    ### Instruction:
                    이 와인은 '%s'이며, 산도는 %d, 바디는 %d, 타닌은 %d입니다.
                    이 와인에 어울리는 안주 정보를 **반드시 JSON 형식**으로만 출력하세요.

                    JSON 형식 규칙:
                    1) 키는 **영어**만 사용 (예: dish_name, youtube_link, ingredients, description).
                    2) 필수 필드: dish_name, youtube_link, ingredients, description
                    3) ingredients 필드는 오브젝트(객체) 형태로, 여러 재료를 key:value로 표기
                    4) 값은 한글을 허용
                    5) 절대 JSON 형식을 깨뜨리지 말 것
                    6) 주어진 예시와 같은 구조를 유지하고, 그 외 설명은 쓰지 않기

                    예시 JSON:
                    {
                      "dish_name": "감바스 알 아히요",
                      "ingredients": {
                        "shrimp": "200g",
                        "garlic": "5개",
                        "olive_oil": "3큰술",
                        "salt": "약간"
                      },
                      "description": "마늘과 올리브 오일에 새우를 익혀 만든 감바스 알 아히요는 와인과 잘 어울리는 대표적인 스페인 요리입니다."
                    }

                    ### Response:
                    """,
                    wine.getKorName(), wine.getAcidity(), wine.getBody(), wine.getTanin());
        } else if (alcoholData instanceof YangjuMongo yangju) {
            return String.format("""
                    ### Instruction:
                    이 양주는 '%s'이며, 도수는 %.1f도입니다.
                    이 양주에 어울리는 안주 정보를 **반드시 JSON 형식**으로만 출력하세요.

                    JSON 형식 규칙:
                    1) 키는 **영어**만 사용 (예: dish_name, youtube_link, ingredients, description).
                    2) 필수 필드: dish_name, youtube_link, ingredients, description
                    3) ingredients 필드는 오브젝트(객체) 형태로, 여러 재료를 key:value로 표기
                    4) 값은 한글을 허용
                    5) 절대 JSON 형식을 깨뜨리지 말 것
                    6) 주어진 예시와 같은 구조를 유지하고, 그 외 설명은 쓰지 않기
                    7) dish_name으로 유튜브 쇼츠를 검색해 가장 상위에 있는 영상 링크를 가져오기

                    예시 JSON:
                    {
                      "dish_name": "닭강정",
                      "ingredients": {
                        "chicken": "500g",
                        "gochujang": "2큰술",
                        "garlic": "3개",
                        "oligodang": "3큰술"
                      },
                      "description": "바삭한 닭강정은 매콤달콤한 소스와 함께 양주와 완벽한 조화를 이룹니다."
                    }

                    ### Response:
                    """,
                    yangju.getKorName(), yangju.getPercent());
        } else {
            throw new IllegalArgumentException("지원하지 않는 주류 타입입니다.");
        }
    }

}
