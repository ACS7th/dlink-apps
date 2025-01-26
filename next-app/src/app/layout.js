import "./globals.css";

export const metadata = {
    title: "DLink",
    description: "The Perfect Link - Drink, Dine, Delight",
};

export default function RootLayout({ children }) {
    return (
        <html lang="kr">
            <body>{children}</body>
        </html>
    );
}
