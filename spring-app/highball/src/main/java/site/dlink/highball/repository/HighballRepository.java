package site.dlink.highball.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import site.dlink.highball.document.Highball;
import site.dlink.highball.enums.HighballCateEnum;


public interface HighballRepository extends MongoRepository<Highball, String> {
    List<Highball> findByCategory(HighballCateEnum category);
}