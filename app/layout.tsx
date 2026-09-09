import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SaySure — Voice Delivery & Pronunciation QA',
  description: 'A voice-quality developer tool that identifies speech risks, controls text delivery, and validates spoken output via Rime TTS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
