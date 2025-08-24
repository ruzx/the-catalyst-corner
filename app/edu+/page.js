import Link from 'next/link';

// You can add more topics to this list as you create them
const topics = [
  {
    slug: 'nmr-basics',
    title: 'NMR Spectroscopy Basics',
    description: 'An introduction to the fundamental principles of Nuclear Magnetic Resonance.'
  },
  {
    slug: 'green-chemistry-principles',
    title: 'The 12 Principles of Green Chemistry',
    description: 'Exploring the foundational concepts for designing sustainable chemical processes.'
  },
  {
    slug: 'nmr-battle',
    title: 'NMR Battle: The Game',
    description: 'Test your knowledge of chemical shifts in this retro arcade shooter!'
  },
  // Add more topics here in the future
];

export default function EducationHub() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Educational Resources</h1>
      <p className="text-lg text-gray-600 mb-8">A collection of articles, infographics, and simulations about chemistry.</p>
      
      <div className="space-y-4">
        {topics.map((topic) => (
          <Link key={topic.slug} href={`/edu+/${topic.slug}`} className="block p-6 border rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all">
            <h2 className="text-2xl font-semibold text-blue-700">{topic.title}</h2>
            <p className="text-gray-600 mt-2">{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}