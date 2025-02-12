package site.dlink.alcohols.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import site.dlink.alcohols.entity.Yangju;

@Repository
public interface YangjuRepository extends ElasticsearchRepository<Yangju, String> {
}
