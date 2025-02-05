"use client";

import CloudScapeLink from "@/components/link/CloudScapeLink";
import { ContentLayout, Header } from "@cloudscape-design/components";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Test() {

    return (
        <ContentLayout
            header={
                <Header variant="h1" info={<CloudScapeLink variant="info">Info</CloudScapeLink>}>
                    검색 결과
                </Header>
            }
        >
        </ContentLayout>
    )
}
