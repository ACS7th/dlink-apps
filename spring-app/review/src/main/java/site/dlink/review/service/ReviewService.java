package site.dlink.review.service;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final MongoTemplate mongoTemplate;

    /**
     * 1) 전체 리뷰 조회 (category 컬렉션)
     */
    public List<Map<String, Object>> getAllReviews(String category, String drinkId) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) {
            return Collections.emptyList();
        }
        List<Map<String, Object>> reviews = (List<Map<String, Object>>) drinkDoc.get("reviews");
        return (reviews != null) ? reviews : Collections.emptyList();
    }

    /**
     * 2) 특정 인덱스 리뷰 조회
     */
    public Map<String, Object> getReview(String category, String drinkId, int reviewIndex) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) return null;

        List<Map<String, Object>> reviews = (List<Map<String, Object>>) drinkDoc.get("reviews");
        if (reviews == null || reviewIndex < 0 || reviewIndex >= reviews.size()) {
            return null;
        }
        return reviews.get(reviewIndex);
    }

    /**
     * 3) 새 리뷰 추가
     */
    public Document createReview(String category, String drinkId, Map<String, Object> newReview) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) {
            return null;
        }

        List<Map<String, Object>> reviews = (List<Map<String, Object>>) drinkDoc.get("reviews");
        if (reviews == null) {
            reviews = new ArrayList<>();
            drinkDoc.put("reviews", reviews);
        }

        reviews.add(newReview);
        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * 4) 리뷰 수정 (인덱스 기반)
     */
    public Document updateReview(String category, String drinkId, int reviewIndex, Map<String, Object> requestData) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) return null;

        List<Map<String, Object>> reviews = (List<Map<String, Object>>) drinkDoc.get("reviews");
        if (reviews == null || reviewIndex < 0 || reviewIndex >= reviews.size()) {
            return null;
        }

        reviews.set(reviewIndex, requestData);
        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * 5) 리뷰 삭제 (인덱스 기반)
     */
    public Document deleteReview(String category, String drinkId, int reviewIndex) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) return null;

        List<Map<String, Object>> reviews = (List<Map<String, Object>>) drinkDoc.get("reviews");
        if (reviews == null || reviewIndex < 0 || reviewIndex >= reviews.size()) {
            return null;
        }

        reviews.remove(reviewIndex);
        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * category 컬렉션에서 drinkId로 문서 조회
     */
    private Document findDrinkDoc(String category, String drinkId) {
        ObjectId objectId;
        try {
            objectId = new ObjectId(drinkId);
        } catch (Exception e) {
            return null;
        }

        return mongoTemplate.findOne(
                Query.query(Criteria.where("_id").is(objectId)),
                Document.class,
                category
        );
    }
}
