import TopNavigationClient from "@/components/navigation/TopNavigationClient";
import { SessionProvider } from "next-auth/react";

export default function LoginLayout({ children }) {
    return (
        <>
            <TopNavigationClient />
            {children}
        </>
    );
}
