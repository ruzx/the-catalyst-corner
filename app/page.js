import Link from 'next/link';

// A super-simple homepage for debugging deployment.
export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">The Catalyst Corner</h1>
      <p className="text-lg text-gray-700">
        Deployment test in progress.
      </p>
      <div className="mt-8">
        <Link href="/cv" className="text-blue-600 hover:underline">
          Go to the test CV page
        </Link>
      </div>
    </div>
  );
}