import json
from kafka import KafkaConsumer
from pymongo import MongoClient

# MongoDB 클라이언트 및 데이터베이스, 컬렉션 설정
mongoClient = MongoClient("mongodb://admin:password@localhost:27017/")
alcoholDatabase = mongoClient["alcoholDatabase"]

brandy = alcoholDatabase["brandy"]
rum = alcoholDatabase["rum"]
gin = alcoholDatabase["gin"]
vodka = alcoholDatabase["vodka"]
liqueur = alcoholDatabase["liqueur"]
tequila = alcoholDatabase["tequila"]
whiskey = alcoholDatabase["whiskey"]

# Kafka Consumer 설정 (모든 토픽을 구독, 일정 시간(10초) 동안 메시지 없으면 종료)
consumer = KafkaConsumer(
    "testBrandyTopic",
    "testRumTopic",
    "testGinTopic",
    "testVodkaTopic",
    "testLiqueurTopic",
    "testTequilaTopic",
    "testWhiskeyTopic",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    consumer_timeout_ms=10000,
    value_deserializer=lambda v: json.loads(v.decode("utf-8"))
)

print("📌 Kafka Consumer 시작 (데이터를 MongoDB에 저장 중...)")

# 토픽 이름과 MongoDB 컬렉션 매핑
topicToCollection = {
    "testBrandyTopic": brandy,
    "testRumTopic": rum,
    "testGinTopic": gin,
    "testVodkaTopic": vodka,
    "testLiqueurTopic": liqueur,
    "testTequilaTopic": tequila,
    "testWhiskeyTopic": whiskey
}

# Kafka 메시지 소비 및 MongoDB에 저장
for message in consumer:
    topicName = message.topic
    data = message.value
    collection = topicToCollection.get(topicName)
    if collection is not None:
        collection.insert_one(data)
        print(f"Inserted into MongoDB {collection.name}: {data}")

consumer.close()
mongoClient.close()
print("모든 토픽의 데이터 소비가 완료되었습니다. 종료합니다.")

