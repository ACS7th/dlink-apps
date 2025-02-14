package site.dlink.common.document.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "wines")
public class WineMongo {

    @Id
    @Field("_id")
    private String id;
    private String korName;
    private String engName;
    private int sweetness;
    private int acidity;
    private int body;
    private int tanin;
    private String foodPairing;
    private String details;
}

