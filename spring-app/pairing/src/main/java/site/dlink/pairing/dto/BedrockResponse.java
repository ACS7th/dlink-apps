package site.dlink.pairing.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
public class BedrockResponse {
    @JsonProperty("유튜브 링크")
    private String youtubeLink;

    @JsonProperty("재료")
    private Map<String, String> ingredients;

    @JsonProperty("소개")
    private String description;
}
