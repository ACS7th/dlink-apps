package site.dlink.alcohols.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.stereotype.Service;

import site.dlink.alcohols.constants.AlcoholConstants;
import site.dlink.alcohols.entity.Wine;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class WineService {

    private final ElasticsearchOperations elasticsearchOperations;

    public Page<Wine> searchWinesByKeyword(String keyword, int page, int size) {
        IndexCoordinates indexCoordinates = IndexCoordinates.of(AlcoholConstants.DATABASE + ".wine");

        NativeQuery query = NativeQuery.builder()
                .withQuery(q -> q.multiMatch(m -> m
                        .query(keyword)
                        .fuzziness("AUTO")
                        .fields("korName", "engName")))
                .withPageable(PageRequest.of(page, size))
                .build();

        SearchHits<Wine> searchHits = elasticsearchOperations.search(query, Wine.class, indexCoordinates);

        List<Wine> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        return new PageImpl<>(results, PageRequest.of(page, size), searchHits.getTotalHits());
    }

    public Page<Wine> findAllWines(int page, int size) {
        IndexCoordinates indexCoordinates = IndexCoordinates.of(AlcoholConstants.DATABASE + ".wine");

        NativeQuery query = NativeQuery.builder()
                .withQuery(q -> q.matchAll(m -> m))
                .withPageable(PageRequest.of(page, size))
                .build();

        SearchHits<Wine> searchHits = elasticsearchOperations.search(query, Wine.class, indexCoordinates);
        log.info("📜 전체 와인 목록 조회: {}", searchHits.getTotalHits());

        List<Wine> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        return new PageImpl<>(results, PageRequest.of(page, size), searchHits.getTotalHits());
    }
}
