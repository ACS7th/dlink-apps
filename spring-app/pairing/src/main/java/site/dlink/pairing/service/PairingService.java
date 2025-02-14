package site.dlink.pairing.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
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
    /**
     * 와인/양주 정보에 따른 prompt를 생성하고, ChatClient로 전송하여 결과를 반환
     */
    public BedrockResponse getPairingRecommendation(Object alcoholData) {
        try {
            // 1) 프롬프트 문자열 구성
            String prompt = createPrompt(alcoholData);

            // 2) ChatClient로 모델 호출 → String 형태 응답
            String rawResponse = chatClient
                    .prompt(prompt)
                    .call()
                    .content();

            // 3) JSON 형태(예: {"유튜브 링크":"...", "재료":{...}, "소개":...})를 BedrockResponse로 역직렬화
            return objectMapper.readValue(rawResponse, BedrockResponse.class);

        } catch (Exception e) {
            log.error("ChatClient 호출 중 오류 발생", e);
            throw new RuntimeException("Bedrock 모델 호출 실패", e);
        }
    }

    /**
     * 기존 createPrompt 로직 그대로 유지 (와인/양주 정보를 이용해 안내 메시지 작성)
     */
    private String createPrompt(Object alcoholData) {
        if (alcoholData instanceof WineMongo wine) {
            return String.format(
                "### Instruction:\n" +
                "이 와인은 '%s'이며, 산도는 %d, 바디는 %d, 타닌은 %d입니다.\n" +
                "이 와인에 어울리는 안주를 아래 JSON 형식으로 추천해 주세요:\n" +
                "{\"유튜브 링크\":\"\", \"재료\":{\"재료명\":\"수량\"}, \"두줄소개\":\"간단한 설명\"}\n" +
                "### Response:\n",
                wine.getKorName(), wine.getAcidity(), wine.getBody(), wine.getTanin()
            );
        } else if (alcoholData instanceof YangjuMongo yangju) {
            return String.format(
                "### Instruction:\n" +
                "이 양주는 '%s'이며, 도수는 %.1f도입니다.\n" +
                "이 양주에 어울리는 안주를 아래 JSON 형식으로 추천해 주세요:\n" +
                "{\"유튜브 링크\":\"\", \"재료\":{\"재료명\":\"수량\"}, \"두줄소개\":\"간단한 설명\"}\n" +
                "### Response:\n",
                yangju.getKorName(), yangju.getPercent()
            );
        } else {
            throw new IllegalArgumentException("지원하지 않는 주류 타입입니다.");
        }
    }
}
