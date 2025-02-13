package site.dlink.alcohols.repository.es;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import site.dlink.alcohols.document.WineEs;

@Repository
public interface WineEsRepository extends ElasticsearchRepository<WineEs, String> {
}
