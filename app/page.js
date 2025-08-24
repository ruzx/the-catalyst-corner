import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to The Catalyst Corner!</h1>
      <p className="text-lg text-gray-700">
        This is a test to confirm the deployment is working.
      </p>
      <div className="mt-8">
        <Link href="/post/my-first-post" className="text-blue-600 hover:underline">
          Click here to view your first blog post.
        </Link>
      </div>
    </div>
  );
}