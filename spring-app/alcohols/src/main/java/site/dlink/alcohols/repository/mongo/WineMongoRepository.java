package site.dlink.alcohols.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

import site.dlink.common.document.mongo.WineMongo;


public interface WineMongoRepository extends MongoRepository<WineMongo, String> {

}