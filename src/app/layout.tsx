
import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VietFlex Engine 2.1.6',
  description: 'Bộ gõ tiếng Việt thông minh cho Chrome OS Flex',
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased selection:bg-primary/20 bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
