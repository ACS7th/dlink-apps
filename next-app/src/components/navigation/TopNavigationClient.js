"use client";

import { useRouter } from "next/navigation";
import { TopNavigation } from "@cloudscape-design/components";
import { signOut, useSession } from "next-auth/react";
import customSignOut from "@/utils/signOut";

export default function TopNavigationClient() {
    const router = useRouter();
    const {data: session, status} = useSession();
    const user = session?.user;

    const handleLogin = () => {
        router.push("/login");
    };

    const handleLogout = () => {
        customSignOut();
    };

    const handleSignup = () => {
        router.push("/signup")
    }

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
                ...(user
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
                              text: `${user.email}`,
                              description: `${user.name}(일반 회원)`,
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
                                      ],
                                  },
                                  { id: "signout", text: "Sign out", onclick: handleLogout },
                              ],
                          },
                      ]
                      
                    : [
                          {
                              type: "button",
                              text: "Log in",
                              onClick: handleLogin,
                          },
                          {
                              type: "button",
                              text: "Sign up",
                              onClick: handleSignup,
                          },
                      ])
            ]}
        />
    );
}
