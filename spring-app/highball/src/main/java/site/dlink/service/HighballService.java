package site.dlink.service;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import site.dlink.document.Highball;
import site.dlink.enums.HighballCateEnum;
import site.dlink.repository.HighballRepository;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HighballService {

    private final HighballRepository highballRepository;


    @Transactional
    public void saveHighball(Highball highball) {
        highballRepository.save(highball);
    }

    @Transactional(readOnly = true)
    public Optional<Highball> findById(String id) {
        return highballRepository.findById(id);
    }

    @Transactional
    public void deleteHighball(String id) {
        highballRepository.deleteById(id);
    }

    public List<Highball> findByCategory(HighballCateEnum category) {
        return highballRepository.findByCategory(category);
    }

    public Highball findHighballById(String id) {
        return highballRepository.findById(id).orElse(null);
    }

    @Transactional
    public long toggleLike(String highballId, String userId) {
        Highball highball = highballRepository.findById(highballId)
                .orElseThrow(() -> new IllegalArgumentException("Highball not found with id: " + highballId));

        if (highball.getLikedUsers().contains(userId)) {
            highball.getLikedUsers().remove(userId);
        } else {
            highball.getLikedUsers().add(userId);
        }

        highballRepository.save(highball);
        return highball.getLikedUsers().size();
    }

    public long getLikeCount(String highballId) {
        return Optional.ofNullable(
                highballRepository.findLikedUsersById(highballId)
        ).map(highball -> highball.getLikedUsers().size())
                .orElse((int) 0L);
    }

}