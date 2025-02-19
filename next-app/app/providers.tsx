"use client";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@heroui/toast";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
    return (
        <SessionProvider>
            <HeroUIProvider>
                <NextThemesProvider
                    defaultTheme="system"
                    attribute="class"
                    {...themeProps}
                >
                    <ToastProvider
                        toastProps={{
                            timeout: 3000
                        }}
                        placement="bottom-center"
                    />
                    {children}
                </NextThemesProvider>
            </HeroUIProvider>
        </SessionProvider>
    );
}
