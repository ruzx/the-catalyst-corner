// Location: app/blog/page.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const getPosts = () => {
    const postsDirectory = path.join(process.cwd(), '_posts');
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames.map(filename => {
        try {
            const slug = filename.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, filename);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);
            return { slug, ...data };
        } catch (error) {
            console.error(`Error processing post: ${filename}`, error);
            return null;
        }
    }).filter(Boolean);
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return posts;
};

export default function BlogIndexPage() {
  const posts = getPosts();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Recent Posts</h1>
      <p className="text-lg text-gray-600 mb-8">Thoughts and updates on chemistry, education, and technology.</p>
      
      <div className="space-y-6">
        {posts.length > 0 ? (
            posts.map(post => (
              // This link now correctly points to /blog/[slug]
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-6 border rounded-lg shadow-sm bg-white hover:bg-gray-50 hover:shadow-md transition-all">
                <h2 className="text-2xl font-semibold text-blue-700">{post.title}</h2>
                <p className="text-gray-700 mt-2">{post.date}</p>
              </Link>
            ))
        ) : (
            <p className="text-gray-600">No blog posts found.</p>
        )}
      </div>
    </div>
  );
}```

### Step 3: Update the Navigation Bar Again

We need to add a "Blog" link back to the main navigation.

**Action:** Replace the entire content of `app/layout.js` with this code.

```jsx
import Link from 'next/link';
import './globals.css';
import { Orbitron, Roboto_Mono } from 'next/font/google';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: 'The Catalyst Corner | Chemistry & Education',
  description: 'An educational resource for green chemistry, NMR spectroscopy, and interactive learning by Ruzal Sitdikov, PhD.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${robotoMono.variable}`}>
      <body>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              The Catalyst Corner
            </Link>
            
            <div className="space-x-4 md:space-x-6 text-lg">
              {/* Added the Blog link back */}
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
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