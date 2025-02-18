
"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import AuthProvider from "@/context/AuthContext";

const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <body>{children}</body>
        </QueryClientProvider>
      </AuthProvider>
    </html>
  );
}
