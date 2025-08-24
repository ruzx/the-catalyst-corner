import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';

const getPostContent = (slug) => {
  const folder = path.join(process.cwd(), '_posts');
  const file = `${folder}/${slug}.md`;
  const content = fs.readFileSync(file, 'utf8');
  const matterResult = matter(content);
  return matterResult;
};

export default function BlogPost({ params }) {
  const slug = params.slug;
  const post = getPostContent(slug);

  return (
    <article className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-lg shadow-md prose prose-lg prose-blue text-gray-800">
      <h1 className="text-4xl font-bold mb-2">{post.data.title}</h1>
      <p className="text-gray-500 mb-8">{post.data.date}</p>
      <Markdown>{post.content}</Markdown>
    </article>
  );
}