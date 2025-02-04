"use client";

import { BreadcrumbGroup, SideNavigation, Spinner } from "@cloudscape-design/components";
import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AppLayoutNoSSR = dynamic(
    () => import("@cloudscape-design/components").then((mod) => mod.AppLayout),
    {
        ssr: false,
        loading: () => <div className="flex justify-center items-center h-screen"><Spinner size="large" /></div>
    }
);

export default function AppLayoutClient({ content }) {
    const [navigationOpen, setNavigationOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const breadcrumbItems = [
        { text: "", href: "/" },
        ...pathname
            .split("/")
            .filter((segment) => segment)
            .map((segment, index, array) => ({
                text: segment,
                href: "/" + array.slice(0, index + 1).join("/"),
            })),
    ];

    const navigationItems = [
        { type: "link", text: "wine", href: "/wine" },
        { type: "link", text: "whiskey", href: "/whiskey" }
        // { type: "link", text: "Brandy", href: "/brandy" },
        // { type: "link", text: "Vodka", href: "/vodka" },
        // { type: "link", text: "Tequila", href: "/tequila" },
        // { type: "link", text: "Gin", href: "/gin" },
        // { type: "link", text: "Rum", href: "/rum" },
        // { type: "link", text: "Cocktail", href: "/cocktail" }
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
