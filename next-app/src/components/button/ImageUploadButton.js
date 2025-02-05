"use client";

import * as React from "react";
import FileUpload from "@cloudscape-design/components/file-upload";
import axios from "axios";

export default function ImageUploadButton() {
  const [imageValue, setImageValue] = React.useState([]);

  const uploadFile = async (file) => {
    // 📌 파일 형식 검증
    if (!(file instanceof File)) {
      console.error("❌ 업로드할 파일이 File 객체가 아닙니다.");
      return;
    }

    // 📌 허용된 확장자 확인 (예: JPG, PNG만 허용)
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      console.error(`❌ 지원하지 않는 파일 형식입니다. (${fileExtension})`);
      return;
    }

    // 📌 파일 크기 제한 (5MB 이하)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error(`❌ 파일 크기가 너무 큽니다. (최대 5MB)`);
      return;
    }

    // 📌 FormData 생성 후 업로드
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/v1/imageupload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("📌 추출된 텍스트:", response.data.text);
    } catch (error) {
      console.error("❌ Upload error:", error);
    }
  };

  return (
    <div className="filebox">
      <FileUpload
        className="file"
        onChange={({ detail }) => {
          setImageValue(detail.value);
          if (detail.value.length > 0) {
            console.log("📌 선택한 파일 정보:", detail.value[0]); // 파일 정보 출력
            uploadFile(detail.value[0]); // ✅ 첫 번째 파일 업로드
          } else {
            console.warn("⚠️ 파일이 선택되지 않았습니다.");
          }
        }}
        value={imageValue}
        i18nStrings={{
          uploadButtonText: (e) => (e ? "Choose files" : "Choose file"),
          dropzoneText: (e) => (e ? "Drop files to upload" : "Drop file to upload"),
          removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
          limitShowFewer: "Show fewer files",
          limitShowMore: "Show more files",
          errorIconAriaLabel: "Error",
          warningIconAriaLabel: "Warning",
        }}
        tokenLimit={3}
      />
    </div>
  );
}
