"use client";

import dynamic from "next/dynamic";

const ContentLayout = dynamic(
    () => import("@cloudscape-design/components").then((mod) => mod.ContentLayout),
    { ssr: false }
);

export default function ContentLayoutClient(props) {
    return <ContentLayout {...props} />;
}
