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
      index: "alcohol_db.*",
      query: {
        multi_match: {
          query: text,
          fields: ["EngName^2", "KorName^2", "상품명"],
          fuzziness: "AUTO",
          analyzer: "custom_multilingual_analyzer"
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
