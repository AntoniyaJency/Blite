import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import SmoothScroll from '../components/SmoothScroll';
import HeroNav from '../components/hero/HeroNav';
import SiteFooter from '../components/footer/SiteFooter';
import './globals.css';

export const metadata: Metadata = {
  title: "Blite — Women's Fitness | Train Your Power",
  description: "A cinematic interactive experience for women's high-performance strength and luxury fitness. Train your power. Build what others can't.",
  keywords: ['Blite', 'womens fitness', 'womens gym', 'strength', 'discipline', 'performance', 'luxury fitness'],
};

export const viewport: Viewport = {
  themeColor: '#07030e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark scroll-smooth">
        <body className="bg-blite-black text-blite-platinum antialiased selection:bg-blite-pink/30 selection:text-white">
          <div className="film-grain" aria-hidden="true" />
          <SmoothScroll>
            <HeroNav />
            {children}
            <SiteFooter />
          </SmoothScroll>
        </body>
      </html>
    </ClerkProvider>
  );
}

