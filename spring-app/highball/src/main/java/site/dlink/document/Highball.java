package site.dlink.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private String making;

    private Map<String, String> ingredients = new HashMap<>();
}
