package site.dlink.alcohols.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document
public class Alcohol {
    @Id
    private String id;
    private String korName;
    private String origin;
    private int percent;
    private int volume;
    private int price;
    private String image;
    private String explanation;
}


