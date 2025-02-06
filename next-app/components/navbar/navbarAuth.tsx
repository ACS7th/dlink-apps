import { Button, Divider } from "@heroui/react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import UserIcon from "../icons/userIcon";
import LoginIcon from "../icons/loginIcon";
import { UserDropdown } from "./user-dropdown";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function NavbarAuth() {
    const session = await getServerSession(authOptions);

    return (
        <div className="w-fit flex items-center gap-2">
            {session ? (
                <UserDropdown />
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
        </div>
    );
}
