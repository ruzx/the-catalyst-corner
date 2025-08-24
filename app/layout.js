import Link from 'next/link';
import './globals.css';

// You can keep your existing metadata
export const metadata = {
  title: 'The Catalyst Corner | Chemistry & Education',
  description: 'An educational resource for green chemistry, NMR spectroscopy, and interactive learning by Ruzal Sitdikov, PhD.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* This head section will apply to all pages */}
      <head>
        {/* Added Google Fonts for the new game */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono&display=swap" rel="stylesheet" />
        
        {/* Added Tone.js script for game audio */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js" async></script>
      </head>

      <body className="bg-gray-50 text-gray-800 dark:text-gray-800">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              The Catalyst Corner
            </Link>
            <div className="space-x-4 md:space-x-6 text-lg">
              <Link href="/edu+" className="text-gray-600 hover:text-blue-600 transition-colors">Edu+</Link>
              <Link href="/cv" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
              <Link href="/nmr-app" className="text-gray-600 hover:text-blue-600 transition-colors">NMR App</Link>
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