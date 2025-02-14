package site.dlink.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@Document(collection = "highball")
public class Highball {

    @Id
    private String id;
    private String category;
    private String engName;
    private String korName;
    private String glass;
    private String image;
    private String youtube;
    private String making;

    private String writeUser;

    private int likeCount;

    private Map<String, String> ingredients = new HashMap<>();
    private Set<String> likedUsers = new HashSet<>();
}
