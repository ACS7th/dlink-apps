"use client";

import CloudScapeLink from "@/components/link/CloudScapeLink";
import { Header } from "@cloudscape-design/components";
import dynamic from "next/dynamic";
import Link from "next/link";

export default function Test() {

    const ContentLayoutNoSSR = dynamic(() => import("@cloudscape-design/components").then((mod) => mod.ContentLayout), { ssr: false });

    return (
        <ContentLayoutNoSSR
            header={
                <Header variant="h1" info={<CloudScapeLink variant="info">Info</CloudScapeLink>}>
                    Test2
                </Header>
            }
        >
        </ContentLayoutNoSSR>
    )
}
