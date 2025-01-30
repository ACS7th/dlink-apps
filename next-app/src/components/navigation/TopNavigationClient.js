"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { TopNavigation } from "@cloudscape-design/components";

export default function TopNavigationClient() {
    const { isLoggedIn, login, logout } = useAuth();
    const router = useRouter();

    const handleLogin = () => {
        router.push("/login");
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <TopNavigation
            identity={{
                href: "/",
                title: "DLink",
                logo: {
                    src: "/favicon.png",
                    alt: "DLink",
                },
            }}
            utilities={[
                ...(isLoggedIn
                    ? [
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
                              text: "email@example.com",
                              description: "일반 회원",
                              iconName: "user-profile",
                              onItemClick: (event) => {
                                  if (event.detail.id === "signout") {
                                      handleLogout();
                                  }
                              },
                              items: [
                                  { id: "profile", text: "Profile" },
                                  { id: "preferences", text: "Preferences" },
                                  {
                                      id: "support-group",
                                      text: "Support",
                                      items: [
                                          {
                                              id: "documentation",
                                              text: "Documentation",
                                              href: "#",
                                              external: true,
                                              externalIconAriaLabel: " (opens in a new tab)",
                                          },
                                          { id: "support", text: "Support" },
                                          {
                                              id: "feedback",
                                              text: "Feedback",
                                              href: "#",
                                              external: true,
                                              externalIconAriaLabel: " (opens in a new tab)",
                                          },
                                      ],
                                  },
                                  { id: "signout", text: "Sign out" },
                              ],
                          },
                      ]
                    : [
                          {
                              type: "button",
                              text: "Sign in",
                              onClick: handleLogin,
                          },
                      ])
            ]}
        />
    );
}
