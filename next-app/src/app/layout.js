import { TopNavigation } from "@cloudscape-design/components";
import "./globals.css";
import "@cloudscape-design/global-styles/index.css"
import TopNavigationClient from "@/components/navigation/TopNavigationClient";
import AppLayoutClient from "@/components/layout/AppLayoutClient";
import Link from "next/link";

export const metadata = {
    title: "DLink",
    description: "The Perfect Link - Drink, Dine, Delight",
};

export default function RootLayout({ children }) {

    return (
        <html
            lang="kr"
            suppressHydrationWarning
        >
            <body>
                <TopNavigationClient />
                <AppLayoutClient content={children} />
            </body>
        </html>
    );
}