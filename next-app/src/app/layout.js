import SessionProviderClient from '@/context/SessionProviderClient';
import './globals.css';
import '@cloudscape-design/global-styles/index.css';
import { AuthProvider } from '@/context/AuthProviderClient';

export const metadata = {
    title: 'DLink',
    description: 'The Perfect Link - Drink, Dine, Delight',
};

export default function RootLayout({ children }) {
    return (
        <html lang="kr">
            <body>
                <SessionProviderClient>
                    {children}
                </SessionProviderClient>
            </body>
        </html>
    );
}
