"use client";

import { BreadcrumbGroup, SideNavigation } from "@cloudscape-design/components";
import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AppLayoutNoSSR = dynamic(() => import("@cloudscape-design/components").then((mod) => mod.AppLayout), { ssr: false });

export default function AppLayoutClient({ content }) {
    const [navigationOpen, setNavigationOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const breadcrumbItems = [
        { text: "Home", href: "/" },
        ...pathname
            .split("/")
            .filter((segment) => segment)
            .map((segment, index, array) => ({
                text: segment,
                href: "/" + array.slice(0, index + 1).join("/"),
            })),
    ];

    const navigationItems = [
        { type: "link", text: "테스트", href: "/test" },
        { type: "link", text: "테스트2", href: "/test2" },
    ];

    return (
        <AppLayoutNoSSR
            breadcrumbs={
                <BreadcrumbGroup
                    items={breadcrumbItems}
                    onFollow={(event) => {
                        event.preventDefault();
                        router.push(event.detail.href);
                    }}
                />
            }
            toolsHide={true}
            navigationOpen={navigationOpen}
            onNavigationChange={(e) => setNavigationOpen(e.detail.open)}
            navigation={
                <SideNavigation
                    header={{ href: "/", text: "Category" }}
                    items={navigationItems}
                    onFollow={(event) => {
                        event.preventDefault();
                        router.push(event.detail.href);
                    }}
                />
            }
            content={content}
        />
    );
}
