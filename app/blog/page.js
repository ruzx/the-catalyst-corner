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
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-6 border rounded-lg shadow-sm bg-white hover:bg-gray-50 hover:shadow-md transition-all">
                <h2 className="text-2xl font-semibold text-blue-700">{post.title}</h2>
                <p className="text-gray-700 mt-2">{post.date}</p>
              </Link>
            ))
        ) : (
   