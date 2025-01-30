"use client";

import CloudScapeLink from "@/components/link/CloudScapeLink";
import { ContentLayout, Header } from "@cloudscape-design/components";
import dynamic from "next/dynamic";
import Link from "next/link";

export default function Test() {

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
