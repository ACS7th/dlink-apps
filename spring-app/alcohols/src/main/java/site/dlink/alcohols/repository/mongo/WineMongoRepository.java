package site.dlink.alcohols.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

import site.dlink.alcohols.document.WineMongo;
public interface WineMongoRepository extends MongoRepository<WineMongo, String> {

}