import TopNavigationClient from "@/components/navigation/TopNavigationClient";
import { AuthProvider } from "@/context/AuthContext";

export default function LoginLayout({ children }) {
    return (
        <AuthProvider>
            <TopNavigationClient />
            {children}
        </AuthProvider>
    );
}
