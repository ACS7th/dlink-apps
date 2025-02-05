import TopNavigationClient from "@/components/navigation/TopNavigationClient";

export default function LoginLayout({ children }) {
    return (
        <>
            <TopNavigationClient />
            {children}
        </>
    );
}
