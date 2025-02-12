package site.dlink.alcohols.entity;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Document(indexName = "alcohols")
public class Yangju {
    @Id
    private String id;

    @Field(type = FieldType.Text)
    private String korName;

    @Field(type = FieldType.Text)
    private String origin;

    @Field(type = FieldType.Float)
    private float percent;

    @Field(type = FieldType.Integer)
    private int volume;

    @Field(type = FieldType.Integer)
    private int price;

    @Field(type = FieldType.Text)
    private String image;

    @Field(type = FieldType.Text)
    private String explanation;
}