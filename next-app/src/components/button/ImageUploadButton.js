"use client";

import * as React from "react";
import FileUpload from "@cloudscape-design/components/file-upload";

export default function ImageUploadButton() {
  const [imagevalue, setimageValue] = React.useState([]);

  return (
    <div className="filebox">
      <FileUpload
        className="file"
        onChange={({ detail }) => setimageValue(detail.imagevalue)}
        value={imagevalue}
        i18nStrings={{
          uploadButtonText: (e) => (e ? "Choose files" : "Choose file"),
          dropzoneText: (e) => (e ? "Drop files to upload" : "Drop file to upload"),
          removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
          limitShowFewer: "Show fewer files",
          limitShowMore: "Show more files",
          errorIconAriaLabel: "Error",
          warningIconAriaLabel: "Warning",
        }}
        showFileLastModified
        showFileSize
        showFileThumbnail
        tokenLimit={3}
      />
    </div>
  );
}
