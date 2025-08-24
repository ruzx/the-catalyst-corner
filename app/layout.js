import Link from 'next/link';
import './globals.css';
// CORRECTED: Import fonts using the next/font module
import { Orbitron, Roboto_Mono } from 'next/font/google';

// CORRECTED: Configure the fonts
const orbitron = Orbitron({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron', // CSS variable for this font
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono', // CSS variable for this font
});

export const metadata = {
  title: 'The Catalyst Corner | Chemistry & Education',
  description: 'An educational resource for green chemistry, NMR spectroscopy, and interactive learning by Ruzal Sitdikov, PhD.',
};

export default function RootLayout({ children }) {
  return (
    // CORRECTED: Apply the font variables to the html tag
    <html lang="en" className={`${orbitron.variable} ${robotoMono.variable}`}>
      {/* The <head> tag is no longer needed here for fonts */}
      <body>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              The Catalyst Corner
            </Link>
            <div className="space-x-4 md:space-x-6 text-lg">
              <Link href="/edu+" className="text-gray-600 hover:text-blue-600 transition-colors">Edu+</Link>
              <Link href="/apps" className="text-gray-600 hover:text-blue-600 transition-colors">Apps</Link>
              <Link href="/cv" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
            </div>
          </nav>
        </header>

        <main>
          {children}
        </main>

        <footer className="text-center py-4 mt-12 border-t text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ruzal Sitdikov. All Rights Reserved.</p>
        </footer>
      </body>
    </html>
  );
}