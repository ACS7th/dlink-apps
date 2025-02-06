"use client";

import { Input, Navbar, NavbarContent, Button, Divider } from "@heroui/react";
import React from "react";
import { useSession, signIn } from "next-auth/react";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import { DarkModeSwitch } from "./darkmodeswitch";
import Link from "next/link";
import UserIcon from "../icons/userIcon";
import LoginIcon from "../icons/loginIcon";

interface Props {
    children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
    const { data: session, status } = useSession();

    return (
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Navbar
                isBordered
                className="w-full"
                classNames={{ wrapper: "w-full max-w-full" }}
            >
                <NavbarContent className="md:hidden">
                    <BurguerButton />
                </NavbarContent>

                <NavbarContent justify="end">
                    <DarkModeSwitch />
                </NavbarContent>

                <NavbarContent
                    justify="end"
                    className="w-fit data-[justify=end]:flex-grow-0"
                >
                    {status === "authenticated" ? (
                        <>
                            {/* <NotificationsDropdown /> */}
                            <UserDropdown />
                        </>
                    ) : (
                        <>
                            <Button
                                as={Link}
                                href="/login"
                                variant="light"
                                startContent={<LoginIcon />}
                                className="px-0"
                            >
                                Login
                            </Button>

                            <Divider orientation="vertical" className="h-6" />

                            <Button
                                as={Link}
                                href="/signup"
                                variant="light"
                                startContent={<UserIcon />}
                                className="px-0"
                            >
                                Sign up
                            </Button>
                        </>
                    )}
                </NavbarContent>
            </Navbar>
            {children}
        </div>
    );
};
