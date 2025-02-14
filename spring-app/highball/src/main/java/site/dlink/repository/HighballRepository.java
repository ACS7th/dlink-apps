package site.dlink.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import site.dlink.document.Highball;
import site.dlink.enums.HighballCateEnum;

public interface HighballRepository extends MongoRepository<Highball, String> {
    List<Highball> findByCategory(HighballCateEnum category);

    @Query(value = "{ '_id': ?0 }", fields = "{ 'likedUsers': 1 }")
    Highball findLikedUsersById(String highballId);
}