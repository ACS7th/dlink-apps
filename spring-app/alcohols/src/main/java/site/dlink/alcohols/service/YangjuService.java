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
import site.dlink.alcohols.constants.AlcoholConstants;
import site.dlink.alcohols.document.es.YangjuEs;
import site.dlink.alcohols.repository.es.YangjuEsRepository;

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
                                .map(index -> AlcoholConstants.DATABASE + "." + index)
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
                                .map(index -> AlcoholConstants.DATABASE + "." + index)
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
