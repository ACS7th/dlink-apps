package site.dlink.alcohols.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import site.dlink.alcohols.constants.MongoConstants;
import site.dlink.alcohols.document.es.YangjuEs;
import site.dlink.alcohols.repository.es.YangjuEsRepository;
import site.dlink.common.constants.AlcoholConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class YangjuService {

        private final ElasticsearchOperations elasticsearchOperations;
        private final YangjuEsRepository yangjuRepository;
        private final MongoTemplate mongoTemplate;

        public Document findDocumentById(String id) {
                ObjectId objectId = new ObjectId(id);

                for (String collectionName : AlcoholConstants.YANGJU_INDICES) {
                        Document result = mongoTemplate.getDb().getCollection(collectionName)
                                        .find(new Document("_id", objectId)).first();
                        if (result != null) {
                                log.info("Found in collection {}", collectionName);
                                result.append("category", collectionName);
                                return result;
                        }
                }
                return null;
        }

/*************  ✨ Codeium Command ⭐  *************/
/**
 * MongoDB에서 모든 양주 문서를 검색하여 각 컬렉션의 문서 목록을 반환합니다.
 *
 * @return 각 양주 컬렉션 이름을 키로 하고, 해당 컬렉션의 문서 리스트를 값으로 하는 맵(Map)
 */

/******  21de7a72-7289-4859-8952-f0be2cf628af  *******/
        public Map<String, List<Document>> findAllDocuments() {
                Map<String, List<Document>> allResults = new HashMap<>();

                for (String collectionName : AlcoholConstants.YANGJU_INDICES) {
                        List<Document> results = mongoTemplate.getDb().getCollection(collectionName)
                                        .find()
                                        .into(new ArrayList<>());

                        log.info("📊 Found {} documents in '{}'", results.size(), collectionName);
                        allResults.put(collectionName, results);
                }

                return allResults;
        }

        public YangjuEs findById(String id) {
                return yangjuRepository.findById(id).orElse(null);
        }

        public Page<YangjuEs> findAllYangjus(int page, int size) {
                IndexCoordinates indexCoordinates = IndexCoordinates.of(Arrays.stream(AlcoholConstants.YANGJU_INDICES)
                                .map(index -> MongoConstants.DATABASE+ "." + index)
                                .toArray(String[]::new));
                
                NativeQuery query = NativeQuery.builder()
                                .withQuery(q -> q.matchAll(m -> m))
                                .withPageable(PageRequest.of(page, size))
                                .build();

                SearchHits<YangjuEs> searchHits = elasticsearchOperations.search(query, YangjuEs.class,
                                indexCoordinates);

                List<YangjuEs> results = searchHits.stream()
                                .map(hit -> hit.getContent())
                                .collect(Collectors.toList());

                return new PageImpl<>(results, PageRequest.of(page, size), searchHits.getTotalHits());
        }

        public Page<YangjuEs> searchYangjusByKeyword(String keyword, int page, int size) {
                IndexCoordinates indexCoordinates = IndexCoordinates.of(Arrays.stream(AlcoholConstants.YANGJU_INDICES)
                                .map(index -> MongoConstants.DATABASE+ "." + index)
                                .toArray(String[]::new));

                boolean isKorean = keyword.chars().anyMatch(ch -> Character.UnicodeBlock
                                .of(ch) == Character.UnicodeBlock.HANGUL_SYLLABLES ||
                                Character.UnicodeBlock.of(ch) == Character.UnicodeBlock.HANGUL_JAMO ||
                                Character.UnicodeBlock.of(ch) == Character.UnicodeBlock.HANGUL_COMPATIBILITY_JAMO);

                String searchField = isKorean ? "korName" : "engName";

                Query matchQuery = Query.of(q -> q
                                .match(m -> m
                                                .field(searchField)
                                                .query(keyword)
                                                .fuzziness("AUTO")));

                NativeQuery query = NativeQuery.builder()
                                .withQuery(matchQuery)
                                .withPageable(PageRequest.of(page, size))
                                .build();

                SearchHits<YangjuEs> searchHits = elasticsearchOperations.search(query, YangjuEs.class,
                                indexCoordinates);

                List<YangjuEs> results = searchHits.stream()
                                .map(hit -> hit.getContent())
                                .collect(Collectors.toList());

                return new PageImpl<>(results, PageRequest.of(page, size), searchHits.getTotalHits());
        }

}
