import type { Metadata } from "next";
import "@/app/globals.css";
import AppProvider from "@/components/app-provider";
import MainLayout from "@/layouts/main-layout";
import { Noto_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Fukushi",
  description: "Fukushi",
};

const notoSans = Noto_Sans({
  weight: "400",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSans.className} suppressHydrationWarning>
        <AppProvider>
          <MainLayout>{children}</MainLayout>
        </AppProvider>
      </body>
    </html>
  );
}
