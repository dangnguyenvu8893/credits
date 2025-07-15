import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';

const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'User Management System',
  description: 'System for managing user information',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`text-gray-200`}>
        {children}
      </body>
    </html>
  );
}
