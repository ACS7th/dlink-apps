package site.dlink.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import site.dlink.document.Highball;
import site.dlink.enums.HighballCateEnum;

public interface HighballRepository extends MongoRepository<Highball, String> {
    List<Highball> findByCategory(HighballCateEnum category);
}