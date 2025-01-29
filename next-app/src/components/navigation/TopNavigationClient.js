"use client";

import dynamic from "next/dynamic";

const TopNavigationNoSSR = dynamic(() => import("@cloudscape-design/components").then((mod) => mod.TopNavigation), { ssr: false });

export default function TopNavigationClient() {
    return (
        <TopNavigationNoSSR
            identity={{
                href: "/",
                title: "Dlink",
                logo: {
                    src: "/favicon.png",
                    alt: "Dlink",
                },
            }}
            utilities={[
                {
                    type: "button",
                    iconName: "notification",
                    title: "Notifications",
                    ariaLabel: "Notifications (unread)",
                    badge: true,
                    disableUtilityCollapse: false,
                },
                {
                    type: "menu-dropdown",
                    iconName: "settings",
                    ariaLabel: "Settings",
                    title: "Settings",
                    items: [
                        { id: "settings-org", text: "Organizational settings" },
                        { id: "settings-project", text: "Project settings" },
                    ],
                },
                {
                    type: "menu-dropdown",
                    text: "Customer Name",
                    description: "email@example.com",
                    iconName: "user-profile",
                    items: [
                        { id: "profile", text: "Profile" },
                        { id: "preferences", text: "Preferences" },
                        { id: "security", text: "Security" },
                        {
                            id: "support-group",
                            text: "Support",
                            items: [
                                {
                                    id: "documentation",
                                    text: "Documentation",
                                    href: "#",
                                    external: true,
                                    externalIconAriaLabel: " (opens in new tab)",
                                },
                                { id: "support", text: "Support" },
                                {
                                    id: "feedback",
                                    text: "Feedback",
                                    href: "#",
                                    external: true,
                                    externalIconAriaLabel: " (opens in new tab)",
                                },
                            ],
                        },
                        { id: "signout", text: "Sign out" },
                    ],
                },
            ]}
        />
    );
}
