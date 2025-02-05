import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { NextResponse } from "next/server";

export const config = {
  runtime: "nodejs",
};

const textract = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Next.js API Route: 이미지 업로드 & Textract 실행
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // ✅ 올바른 파일 변환 방식 (Buffer 사용)
    const imageBuffer = Buffer.from(await file.arrayBuffer());

    // AWS Textract 실행
    const textractCommand = new AnalyzeDocumentCommand({
      Document: { Bytes: imageBuffer },
      FeatureTypes: ["FORMS"],
    });

    const textractResponse = await textract.send(textractCommand);

    // 추출된 텍스트 가져오기
    const extractedText = textractResponse.Blocks
      .filter((b) => b.BlockType === "LINE")
      .map((l) => l.Text)
      .join("\n");

    console.log("📌 추출된 텍스트:", extractedText);

    const sumtext = extractedText.replace(/\n/g, " ");
    console.log("📌 합쳐진 텍스트:", sumtext);

    return NextResponse.json({ text: sumtext }, { status: 200 });
  } catch (error) {
    console.error("❌ Textract Error:", error);
    return NextResponse.json({ error: "Textract failed", details: error.message }, { status: 500 });
  }
}
