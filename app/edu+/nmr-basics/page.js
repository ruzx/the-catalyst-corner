import Image from 'next/image';

// This is a placeholder for a future interactive component.
// You would build this with React, just like your NMR app!
const SimulationPlaceholder = () => (
  <div className="p-8 my-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
    <h3 className="text-xl font-semibold text-gray-700">Interactive Simulation Coming Soon!</h3>
    <p className="text-gray-500 mt-2">This is where a game or simulation will go.</p>
  </div>
);

export default function NMRBasicsPage() {
  return (
    <article className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-lg shadow-md prose prose-lg prose-blue text-gray-800">
      <h1>NMR Spectroscopy Basics</h1>
      
      <p>
        Nuclear Magnetic Resonance (NMR) spectroscopy is an analytical chemistry technique used in quality control and research for determining the content and purity of a sample as well as its molecular structure. This page will cover the fundamental concepts.
      </p>

      <h2>The Principle of NMR</h2>
      <p>
        The principle behind NMR is that many nuclei have spin and all nuclei are electrically charged. If an external magnetic field is applied, an energy transfer is possible between the base energy to a higher energy level. The energy transfer takes place at a wavelength that corresponds to radio frequencies and when the spin returns to its base level, energy is emitted at the same frequency. The signal that matches this transfer is measured and processed in order to yield an NMR spectrum for the nucleus concerned.
      </p>

      {/* --- Image/Infographic Section --- */}
      <div className="not-prose my-8"> {/* 'not-prose' prevents prose styles from messing up the image container */}
        <Image 
          src="/nmr-infographic.png" // IMPORTANT: Make sure you have this image in your 'public' folder
          alt="Diagram explaining the basics of NMR"
          width={700}
          height={400}
          className="rounded-lg shadow-md mx-auto"
        />
        <p className="text-center text-sm text-gray-500 mt-2">A simplified diagram of the NMR process.</p>
      </div>
      
      <h2>Chemical Shift</h2>
      <p>
        The chemical shift of a nucleus is the resonance frequency of that nucleus relative to a standard in a magnetic field. The position and number of chemical shifts are diagnostic of the structure of a molecule.
      </p>

      {/* --- Interactive Component Section --- */}
      <SimulationPlaceholder />

    </article>
  );
}