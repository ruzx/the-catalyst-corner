import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function BlogIndex() {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return { slug, ...data };
  });

  // Sort posts by date in descending order
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-6 border rounded-lg hover:bg-gray-50">
            <h2 className="text-2xl font-semibold text-blue-700">{post.title}</h2>
            <p className="text-gray-500 mt-2">{post.date}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}