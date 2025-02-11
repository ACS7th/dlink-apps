package site.dlink.alcohols.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import site.dlink.alcohols.entity.Alcohol;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface AlcoholRepository extends MongoRepository<Alcohol, String> {
    Page<Alcohol> findByKorNameContaining(String keyword, Pageable pageable);
}
