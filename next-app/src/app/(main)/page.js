"use client";

import ContentLayoutClient from "@/components/layout/ContentLayoutClient";
import CloudScapeLink from "@/components/link/CloudScapeLink";
import { Header } from "@cloudscape-design/components";

export default function Home() {

    return (
        <ContentLayoutClient
            header={
                <Header variant="h1" info={<CloudScapeLink variant="info">Info</CloudScapeLink>}>
                    Home
                </Header>
            }
        >
        </ContentLayoutClient>
    );
}
