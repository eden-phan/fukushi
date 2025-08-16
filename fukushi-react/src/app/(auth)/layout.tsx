import type { Metadata } from "next";
import "@/app/globals.css";
import AppProvider from "@/components/app-provider"

export const metadata: Metadata = {
  title: "Fukushi",
  description: "Fukushi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ja">
      <body suppressHydrationWarning>
        <AppProvider>
            <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
