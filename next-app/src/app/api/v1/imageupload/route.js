import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Next.js의 기본 bodyParser 비활성화
  },
};

const textract = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    // formidable을 사용하여 파일 데이터 파싱
    const form = new formidable.IncomingForm();

    const parsedForm = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = parsedForm.files.file;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 파일을 읽어 Buffer로 변환
    const imageBuffer = fs.readFileSync(file.filepath);

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

    return NextResponse.json({ text: extractedText }, { status: 200 });
  } catch (error) {
    console.error("❌ Textract Error:", error);
    return NextResponse.json({ error: "Textract failed" }, { status: 500 });
  }
}
