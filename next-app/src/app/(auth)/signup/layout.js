import TopNavigationClient from "@/components/navigation/TopNavigationClient";

export default function SignupLayout({ children }) {
    return (
        <>
            <TopNavigationClient />
            {children}
        </>
    );
}
