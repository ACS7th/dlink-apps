package site.dlink.review.service;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import site.dlink.review.dto.ReviewRequest;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final MongoTemplate mongoTemplate;

    /**
     * (1) 전체 리뷰 조회
     * - DB 문서 구조: { reviews: { "userId": { rating, content } } }
     */
    public Map<String, Object> getAllReviews(String category, String drinkId) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) {
            return Collections.emptyMap();
        }
        Map<String, Object> reviews = drinkDoc.get("reviews", Map.class);
        if (reviews == null) {
            return Collections.emptyMap();
        }
        return reviews; // 모든 리뷰 반환
    }

    /**
     * (2) 새 리뷰 추가
     */
    public Document createReview(String category, String drinkId, String userId, ReviewRequest request) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) {
            return null;
        }

        Map<String, Object> reviews = drinkDoc.get("reviews", Map.class);
        if (reviews == null) {
            reviews = new HashMap<>();
            drinkDoc.put("reviews", reviews);
        }

        Map<String, String> reviewMap = new HashMap<>();
        reviewMap.put("rating", request.getRating());
        reviewMap.put("content", request.getContent());

        reviews.put(userId, reviewMap);

        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * (3) 리뷰 수정
     */
    public Document updateReviewByUserId(String category, String drinkId, String userId, ReviewRequest request) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) return null;

        Map<String, Object> reviews = drinkDoc.get("reviews", Map.class);
        if (reviews == null || !reviews.containsKey(userId)) {
            return null;
        }

        Map<String, String> newData = new HashMap<>();
        newData.put("rating", request.getRating());
        newData.put("content", request.getContent());

        reviews.put(userId, newData);

        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * (4) 리뷰 삭제
     */
    public Document deleteReviewByUserId(String category, String drinkId, String userId) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) return null;

        Map<String, Object> reviews = drinkDoc.get("reviews", Map.class);
        if (reviews == null || !reviews.containsKey(userId)) {
            return null;
        }

        reviews.remove(userId);
        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * 음료 문서 찾기
     */
    private Document findDrinkDoc(String category, String drinkId) {
        try {
            ObjectId objectId = new ObjectId(drinkId);
            return mongoTemplate.findOne(
                    Query.query(Criteria.where("_id").is(objectId)),
                    Document.class,
                    category
            );
        } catch (Exception e) {
            return null;
        }
    }
}
