"use client";

import * as React from "react";
import CloudScapeLink from "@/components/link/CloudScapeLink";
import { Box, ContentLayout, Header } from "@cloudscape-design/components";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Grid from "@cloudscape-design/components/grid";

export default function Wine_list() {
  const placeholderItems = new Array(12).fill(null); // 더 많은 박스 추가

  useEffect(() => {
    axios.get("/api/v1/test", {}, { withCredentials: true })
      .then(response => console.log("응답 데이터:", response.data))
      .catch(error => console.error("API 요청 실패:", error));
  }, []);

  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<CloudScapeLink variant="info"></CloudScapeLink>}>
          Wine_list
        </Header>
      }
    >
      <div className="container">
        {placeholderItems.map((_, index) => (
          <div key={index} className="imageBox">
            <div className="imagePlaceholder">
              <img src="/LOGO2.png"></img>
            </div>
            <p className="name">상품명</p>
          </div>
        ))}
      </div>

    </ContentLayout>
  );
}
