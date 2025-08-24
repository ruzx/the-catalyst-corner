// This is the content from your old blog page, now serving as the homepage.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function HomePage() { // Renamed from BlogIndex to HomePage for clarity
  const postsDirectory = path.join(process.cwd(), '_posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return { slug, ...data };
  });

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Recent Posts</h1>
      <p className="text-lg text-gray-600 mb-8">Thoughts and updates on chemistry, education, and technology.</p>
      
      <div className="space-y-6">
        {posts.map(post => (
          // CHANGED: The link now points to /post/ instead of /blog/
          <Link key={post.slug} href={`/post/${post.slug}`} className="block p-6 border rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all">
            <h2 className="text-2xl font-semibold text-blue-700">{post.title}</h2>
            <p className="text-gray-500 mt-2">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}