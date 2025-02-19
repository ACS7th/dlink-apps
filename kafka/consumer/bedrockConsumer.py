import os
import json
import logging
import boto3
from botocore.config import Config
from kafka import KafkaConsumer
from pymongo import MongoClient

# --------------------------------------------------
def loadAwsCredentials():
    """AWS 자격 증명을 CSV 파일에서 로드합니다."""
    try:
        with open('/home/kevin/project/kafka/consumer/dalbok_accessKeys.csv', 'r') as file:
            next(file)  # 헤더 행 건너뛰기
            credentials = next(file).strip().split(',')
            os.environ['AWS_ACCESS_KEY_ID'] = credentials[0]
            os.environ['AWS_SECRET_ACCESS_KEY'] = credentials[1]
            os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'
    except Exception as e:
        logging.error("AWS 자격 증명 로드 실패: %s", e)
        raise

# AWS 자격 증명 로드
loadAwsCredentials()

# --------------------------------------------------
# 로깅 설정
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# --------------------------------------------------
# AWS 클라이언트 설정 (Bedrock은 us-east-1, 버지니아 북부)
bedrockClient = boto3.client(
    'bedrock-runtime',
    region_name='us-east-1',
    config=Config(retries=dict(max_attempts=3))
)

# --------------------------------------------------
def summarizeWithBedrock(explanation):
    """
    AWS Bedrock을 사용하여 입력 텍스트를 3줄 요약합니다.
    요청 메시지에 요약 지시 문구를 포함합니다.
    """
    try:
        promptText = f"당신은 주류 3줄 요약 전문가입니다. 다음 텍스트를 3줄로 요약해주주세요.:\n\n{explanation}"
        requestBody = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 200,
            "top_k": 200,
            "stop_sequences": [],
            "temperature": 1,
            "top_p": 0.999,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": promptText
                        }
                    ]
                }
            ]
        }

        response = bedrockClient.invoke_model(
            ModelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
            ContentType="application/json",
            Accept="application/json",
            Body=json.dumps(requestBody)
        )

        responseBody = response["Body"].read().decode('utf-8')
        result = json.loads(responseBody)
        summary = result.get("summary", "")
        if summary:
            return summary
        else:
            logging.error("요약 결과가 비어 있습니다.")
            return "요약 실패"
    except Exception as e:
        logging.error(f"❌ Bedrock 요약 실패: {e}")
        return "요약 실패"

# --------------------------------------------------
# Kafka Consumer 생성
kafkaConsumer = KafkaConsumer(
    'brandyTopic', 'ginTopic', 'rumTopic', 'whiskeyTopic', 'vodkaTopic', 'tequilaTopic', 'liqueurTopic',
    bootstrap_servers=['localhost:9092'],
    group_id='bedrockConsumerGroup',
    auto_offset_reset='earliest',
    value_deserializer=lambda v: json.loads(v.decode('utf-8'))
)

# --------------------------------------------------
# MongoDB 연결
mongoClient = MongoClient("mongodb://admin:password@localhost:27017/")
db = mongoClient['alcoholDatabase']  # 실제 DB 이름으로 수정

# --------------------------------------------------
# Kafka 토픽에 따른 MongoDB 컬렉션 매핑
topicToCollection = {
    "brandyTopic": "brandy",
    "ginTopic": "gin",
    "rumTopic": "rum",
    "whiskeyTopic": "whiskey",
    "vodkaTopic": "vodka",
    "tequilaTopic": "tequila",
    "liqueurTopic": "liqueur"
}

# --------------------------------------------------
# 메시지 처리 및 MongoDB 업데이트
for message in kafkaConsumer:
    data = message.value
    explanation = data.get("explanation", "")
    collectionName = topicToCollection.get(message.topic, None)

    if collectionName and explanation:
        logging.info(f"📨 {collectionName} Collection 업데이트 중: {data['korName']}")

        summarizedText = summarizeWithBedrock(explanation)

        if summarizedText != "요약 실패":
            collection = db[collectionName]
            updateResult = collection.update_one(
                {"korName": data["korName"]},
                {"$set": {"explanation": summarizedText}},
                upsert=True
            )
            if updateResult.modified_count > 0 or updateResult.upserted_id:
                logging.info(f"✅ {data['korName']} - MongoDB 업데이트 완료")
            else:
                logging.warning(f"⚠️ {data['korName']} - 업데이트할 내용 없음")
        else:
            logging.error(f"❌ {data['korName']} - Bedrock 요약 실패, 저장 안 함")

logging.info("📡 Kafka Consumer 종료")

