"use client";

import CloudScapeLink from "@/components/link/CloudScapeLink";
import { ContentLayout, Header } from "@cloudscape-design/components";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Test() {

    useEffect(() => {
        // axios.get("/api/v1/test", {}, { withCredentials: true })
        //     .then(response => console.log("응답 데이터:", response.data))
        //     .catch(error => console.error("API 요청 실패:", error));
    }, []);

    return (
        <ContentLayout
            header={
                <Header variant="h1" info={<CloudScapeLink variant="info">Info</CloudScapeLink>}>
                    Test
                </Header>
            }
        >
        </ContentLayout>
    )
}
