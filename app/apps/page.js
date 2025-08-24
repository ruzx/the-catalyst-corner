import Link from 'next/link';

// A list of all your available applications
const applets = [
  {
    slug: '/apps/impurity-checker',
    title: 'NMR Impurity Checker',
    description: 'Paste your 1H-NMR data to visualize the spectrum and identify common laboratory impurities.'
  },
  {
    slug: '/apps/old-nmr-app',
    title: 'NMR Shift Explorer',
    description: 'A reference table of ¹H and ¹³C NMR shifts for common solvents and impurities from literature data.'
  }
  // Add more applets here in the future
];

export default function AppsHub() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Educational Applets</h1>
      <p className="text-lg text-gray-600 mb-8">Interactive tools to help explore concepts in chemistry.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applets.map((app) => (
          <Link key={app.slug} href={app.slug} className="block p-6 border rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all">
            <h2 className="text-2xl font-semibold text-blue-700">{app.title}</h2>
            <p className="text-gray-600 mt-2">{app.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}