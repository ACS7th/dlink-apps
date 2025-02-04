"use client";

import CloudScapeLink from "@/components/link/CloudScapeLink";
import { ContentLayout, Header } from "@cloudscape-design/components";

export default function Test() {

    return (
        <ContentLayout
            header={
                <Header variant="h1" info={<CloudScapeLink variant="info">Info</CloudScapeLink>}>
                    Cocktail
                </Header>
            }
        >
        </ContentLayout>
    )
}
