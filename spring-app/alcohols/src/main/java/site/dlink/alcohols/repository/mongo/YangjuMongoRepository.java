package site.dlink.alcohols.repository.mongo;


import org.springframework.data.mongodb.repository.MongoRepository;

import site.dlink.alcohols.document.YangjuMongo;

public interface YangjuMongoRepository extends MongoRepository<YangjuMongo, String> {
}

