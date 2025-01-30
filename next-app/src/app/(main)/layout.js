import TopNavigationClient from '@/components/navigation/TopNavigationClient';
import AppLayoutClient from '@/components/layout/AppLayoutClient';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
    title: 'DLink Main',
    description: '메인 페이지',
};

export default function MainLayout({ children }) {
    return (
        <AuthProvider>
            <TopNavigationClient />
            <AppLayoutClient content={children} />
        </AuthProvider>
    );
}
