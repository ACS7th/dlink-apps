import { Client } from "@elastic/elasticsearch";
import { NextResponse } from "next/server";

const esClient = new Client({
  node: "http://192.168.2.150:9200",
  auth: {
    username: "elastic",
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  // node: "https://es.asordk.synology.me/"
});

// ✅ Elasticsearch 검색 API
export async function POST(req) {
  try {
    const { text } = await req.json();

    const esResponse = await esClient.search({
      index: "alcohol_db.*", // 모든 관련 인덱스 검색
      query: {
        multi_match: {
          query: text,
          fields: ["EngName", "KorName", "상품명"], // 영어와 한글 필드 검색
          fuzziness: "AUTO",                       // 유사도 기반 검색 허용
          analyzer: "nori_synonym_analyzer"        // ✅ 동의어 분석기 적용
        }
      }
    });

    const matchedWines = esResponse.hits.hits.map((hit) => hit._source);
    console.log("📌 Elasticsearch 검색 결과:", matchedWines);

    return NextResponse.json({ results: matchedWines }, { status: 200 });
  } catch (error) {
    console.error("❌ Elasticsearch Error:", error);
    return NextResponse.json({ error: "Elasticsearch search failed", details: error.message }, { status: 500 });
  }
}
