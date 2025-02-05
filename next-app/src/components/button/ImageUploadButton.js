"use client";

import * as React from "react";
import FileUpload from "@cloudscape-design/components/file-upload";
import axios from "axios";

export default function ImageUploadButton() {
  const [imageValue, setImageValue] = React.useState([]);

  const uploadFile = async (file) => {
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
            uploadFile(detail.value[0]); // 첫 번째 파일 업로드
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
