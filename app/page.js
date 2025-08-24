import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-84px)] px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800">
        The Catalyst Corner
      </h1>
      <p className="mt-4 max-w-2xl text-xl text-gray-600">
        Exploring green chemistry, biobased materials, and interactive educational tools.
      </p>
      <p className="mt-2 text-md text-gray-500">
        A project by Ruzal Sitdikov, PhD
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/blog" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          Read the Blog
        </Link>
        <Link href="/apps" className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
          Try the Apps
        </Link>
        <Link href="/edu+" className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
          Learn More (Edu+)
        </Link>
      </div>
    </div>
  );
}