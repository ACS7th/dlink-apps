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
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import site.dlink.alcohols.constants.AlcoholConstants;
import site.dlink.alcohols.entity.Yangju;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class YangjuService {

    private final ElasticsearchOperations elasticsearchOperations;

    public Page<Yangju> findAllYangjus(int page, int size) {
        IndexCoordinates indexCoordinates = IndexCoordinates.of(Arrays.stream(AlcoholConstants.YANGJU_INDICES)
                .map(index -> AlcoholConstants.DATABASE + "." + index)
                .toArray(String[]::new));

        NativeQuery query = NativeQuery.builder()
                .withQuery(q -> q.matchAll(m -> m))
                .withPageable(PageRequest.of(page, size))
                .build();

        SearchHits<Yangju> searchHits = elasticsearchOperations.search(query, Yangju.class, indexCoordinates);

        List<Yangju> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        return new PageImpl<>(results, PageRequest.of(page, size), searchHits.getTotalHits());
    }

    public Page<Yangju> searchYangjusByKeyword(String keyword, int page, int size) {
        IndexCoordinates indexCoordinates = IndexCoordinates.of(Arrays.stream(AlcoholConstants.YANGJU_INDICES)
                .map(index -> AlcoholConstants.DATABASE + "." + index)
                .toArray(String[]::new));

        Query multiMatchQuery = Query.of(q -> q
                .multiMatch(m -> m
                        .query(keyword)
                        .fuzziness("AUTO")
                        .fields("korName", "engName")));

        NativeQuery query = NativeQuery.builder()
                .withQuery(multiMatchQuery)
                .withPageable(PageRequest.of(page, size))
                .build();

        SearchHits<Yangju> searchHits = elasticsearchOperations.search(query, Yangju.class, indexCoordinates);

        List<Yangju> results = searchHits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        return new PageImpl<>(results, PageRequest.of(page, size), searchHits.getTotalHits());
    }
}
