package site.dlink.alcohols.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import site.dlink.alcohols.entity.Wine;
import org.springframework.stereotype.Repository;

@Repository
public interface WineRepository extends ElasticsearchRepository<Wine, String> {
}
