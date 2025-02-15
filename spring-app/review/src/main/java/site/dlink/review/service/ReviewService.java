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
     * 1) 전체 리뷰 조회
     *  - DB 문서 구조: { reviews: { "some@email": { rating, content } } }
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
        return reviews;
    }

    /**
     * 2) 특정 이메일 리뷰 조회
     */
    public Map<String, Object> getReviewByEmail(String category, String drinkId, String email) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) return null;

        Map<String, Object> reviews = drinkDoc.get("reviews", Map.class);
        if (reviews == null) return null;

        Object reviewData = reviews.get(email); // { rating, content }
        if (reviewData == null) {
            return null;
        }
        return (Map<String, Object>) reviewData;
    }

    /**
     * 3) 새 리뷰 추가 (또는 덮어쓰기)
     *  - email 키를 만들고, 그 값으로 { rating, content }를 저장
     */
    public Document createReview(String category,
                                 String drinkId,
                                 String userEmail,
                                 ReviewRequest request) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) {
            return null;
        }

        // "reviews" 필드가 없으면 새로 생성
        Map<String, Object> reviews = drinkDoc.get("reviews", Map.class);
        if (reviews == null) {
            reviews = new HashMap<>();
            drinkDoc.put("reviews", reviews);
        }

        // 리뷰 객체 생성: { "rating": "...", "content": "..." }
        Map<String, String> reviewMap = new HashMap<>();
        reviewMap.put("rating", request.getRating());
        reviewMap.put("content", request.getContent());

        // reviews[email] = { rating, content }
        reviews.put(userEmail, reviewMap);

        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * 4) 리뷰 수정 (이메일 기반)
     *   - 기존 리뷰가 없으면 null
     */
    public Document updateReviewByEmail(String category,
                                        String drinkId,
                                        String email,
                                        ReviewRequest request) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) return null;

        Map<String, Object> reviews = drinkDoc.get("reviews", Map.class);
        if (reviews == null || !reviews.containsKey(email)) {
            return null; // 해당 email 리뷰 없음
        }

        // 기존 리뷰를 덮어씀
        Map<String, String> newData = new HashMap<>();
        newData.put("rating", request.getRating());
        newData.put("content", request.getContent());

        reviews.put(email, newData);

        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * 5) 리뷰 삭제 (이메일 기반)
     */
    public Document deleteReviewByEmail(String category, String drinkId, String email) {
        Document drinkDoc = findDrinkDoc(category, drinkId);
        if (drinkDoc == null) return null;

        Map<String, Object> reviews = drinkDoc.get("reviews", Map.class);
        if (reviews == null || !reviews.containsKey(email)) {
            return null;
        }

        reviews.remove(email);
        mongoTemplate.save(drinkDoc, category);
        return drinkDoc;
    }

    /**
     * category 컬렉션에서 drinkId로 문서 조회
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
