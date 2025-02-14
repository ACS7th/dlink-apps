package site.dlink.highball.document;

import lombok.Builder;
import lombok.Data;
import site.dlink.highball.enums.HighballCateEnum;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@Document(collection = "highball")
@Builder
public class Highball {

    @Id
    private String id;
    private HighballCateEnum category;
    private String engName;
    private String korName;
    private String glass;
    private String imageFilename;
    private String imageUrl;
    private String making;
    private String writeUser;
    @Builder.Default
    private Integer likeCount = 0;
    @Builder.Default
    private Map ingredients = new HashMap<>();
    @Builder.Default
    private Set<String> likedUsers = new HashSet<>();
}
