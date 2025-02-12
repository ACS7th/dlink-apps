package site.dlink.alcohols.entity;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;

@Data
@Document(indexName = "wines")
public class Wine {
    @Id
    private String id;

    @Field(type = FieldType.Text)
    private String korName;

    @Field(type = FieldType.Text)
    private String engName;

    @Field(type = FieldType.Integer)
    private int sweetness;

    @Field(type = FieldType.Integer)
    private int acidity;

    @Field(type = FieldType.Integer)
    private int body;

    @Field(type = FieldType.Integer)
    private int tanin;

    @Field(type = FieldType.Text)
    private String foodPairing;

    @Field(type = FieldType.Text)
    private String details;

}
