import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { NextResponse } from "next/server";

const textract = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ 이미지에서 텍스트 추출 API
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const textractCommand = new AnalyzeDocumentCommand({
      Document: { Bytes: imageBuffer },
      FeatureTypes: ["FORMS"],
    });

    const textractResponse = await textract.send(textractCommand);

    const extractedText = textractResponse.Blocks
      .filter((b) => b.BlockType === "LINE")
      .map((l) => l.Text)
      .join(" ");

    console.log("📌 추출된 텍스트:", extractedText);

    const sumtext = extractedText.replace(/\n/g, " ");
    console.log("📌 합쳐진 텍스트:", sumtext);

    return NextResponse.json({ text: sumtext }, { status: 200 });
  } catch (error) {
    console.error("❌ Textract Error:", error);
    return NextResponse.json({ error: "Textract failed", details: error.message }, { status: 500 });
  }
}
