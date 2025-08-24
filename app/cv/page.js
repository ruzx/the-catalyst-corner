export default function CVPage() {
  // Utility component for consistent experience blocks
  const ExperienceBlock = ({ period, title, institution, location, children }) => (
    <div className="relative pl-6 border-l-2 border-gray-200 py-2">
      <div className="absolute -left-[5px] top-4 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
      {/* CHANGED: Increased contrast for the date */}
      <p className="text-sm text-gray-700">{period}</p>
      {/* CHANGED: Made the job title nearly black for high contrast */}
      <h3 className="text-lg font-bold text-gray-900 mt-0.5">{title}</h3>
      {/* CHANGED: Increased contrast for the institution name */}
      <p className="text-md text-gray-800">{institution}, {location}</p>
      {/* CHANGED: Increased contrast for the bullet points */}
      <ul className="list-disc list-inside mt-3 text-gray-700 text-sm space-y-1">
        {children}
      </ul>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white my-12 rounded-lg shadow-lg">
      
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">Ruzal Sitdikov</h1>
          <p className="mt-2 text-xl text-blue-600">PhD Chemist | Biobased Materials, Organic Synthesis</p>
        </div>
        <div className="mt-4 sm:mt-0 text-left sm:text-right text-sm text-gray-700 space-y-1">
          <p>Uppsala, Sweden</p>
          <p><a href="mailto:ruzal.sitdikov@ilk.uu.se" className="text-blue-600 hover:underline">ruzal.sitdikov@ilk.uu.se</a></p>
        </div>
      </header>

      <div className="flex flex-wrap gap-x-4 gap-y-2 py-4 text-sm border-b">
        <a href="https://www.linkedin.com/in/ruzal" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">LinkedIn</a>
        <a href="https://scholar.google.com/citations?user=3sHiXqAAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">Google Scholar</a>
        <a href="https://orcid.org/0000-0002-1362-3819" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">ORCID: 0000-0002-1362-3819</a>
      </div>

      <section className="mt-6">
        <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4">Summary</h2>
        <p className="text-gray-800 leading-relaxed">
          Research Chemist with 10+ years of international experience in organic synthesis, methodology development, and material characterization, with a strong interest in green chemistry and sustainable materials. Expertise in modifying carbohydrates and developing functional materials using techniques including click chemistry and organocatalysis-relevant transformations. Proven ability in optimizing synthetic processes, scaling considerations, and comprehensive analytical characterization. Fluent in English; Proficient in Swedish (B1-B2).
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4">Core Competencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h3 className="font-semibold text-gray-800">Green & Biobased Chemistry</h3>
            <p className="text-sm text-gray-700">Carbohydrate Modification, Oligomer Synthesis, Click Chemistry, Catalysis, Sustainable Synthesis, Process Optimization</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Material Synthesis & Analysis</h3>
            <p className="text-sm text-gray-700">Organic Synthesis, Methodology Development (Electro/Photo-chemistry), Isotopic Labeling, Purification, Scale-up</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Characterization</h3>
            <p className="text-sm text-gray-700">NMR (1D/2D), MS (GC-MS, LC-MS, HRMS), HPLC, GC, FT-IR, UV-Vis, DLS, Microscopy</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Laboratory & R&D Skills</h3>
            <p className="text-sm text-gray-700">Experiment Design, Instrument Maintenance, Safety Protocols, Data Analysis, Method Development, Cross-functional Collaboration</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4">Professional Experience</h2>
        <div className="space-y-6">
          <ExperienceBlock
            period="Aug 2023 – PRESENT"
            title="Research Scientist"
            institution="Uppsala University (UU)"
            location="Sweden"
          >
            <li>Leading the development of sustainable metalla-electrocatalytic methods for C–H functionalization with applications in biomass valorization and the synthesis of complex organic molecules relevant to environmental science.</li>
            <li>Established and manage a state-of-the-art electrochemistry laboratory, including procurement, installation, and maintenance of specialized instrumentation (e.g., potentiostats, reactors).</li>
          </ExperienceBlock>

          <ExperienceBlock
            period="Nov 2021 – Jul 2023"
            title="Researcher (Sensors and Electrochemistry)"
            institution="KTH Royal Institute of Technology (KTH)"
            location="Sweden"
          >
            <li>Designed and synthesized novel organometallic redox probes (Ru/Os-based) for advanced voltammetric ion-selective electrodes, developing 'early-warning' sensor methodologies for ion detection in aqueous media.</li>
            <li>Fabricated and characterized ferrocene-based self-assembled monolayers as redox mediators for electrochemical sensing applications.</li>
          </ExperienceBlock>

          <ExperienceBlock
            period="Dec 2018 – Oct 2021"
            title="Postdoctoral Fellow"
            institution="KAUST Catalysis Center"
            location="Saudi Arabia"
          >
            <li>Developed Ni-catalyzed electrochemical protocols for sustainable synthesis, including C-H deuteration and reductive cross-electrophile coupling, minimizing the use of chemical reagents.</li>
            {/* CHANGED: Correctly formatted the chemical formula using HTML tags. */}
            <li>Created electrochemical methods for late-stage isotopic labeling (<sup>13</sup>CD<sub>3</sub>), a key technique for mechanistic studies and tracer analysis in environmental chemistry.</li>
          </ExperienceBlock>

          <ExperienceBlock
            period="Aug 2017 – Sept 2018"
            title="Postdoc & Project Researcher"
            institution="Åbo Akademi University (ÅAU)"
            location="Finland"
          >
            <li>Synthesized novel mannitol-derived supramolecular organogelators and demonstrated their ability for phase-selective gelation of hydrocarbons from aqueous environments, relevant to oil-spill remediation.</li>
          </ExperienceBlock>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4">Teaching & Supervision</h2>
        <div className="space-y-6">
            <ExperienceBlock
                period="2022"
                title="Instructor / Training Delivery"
                institution="KTH Royal Institute of Technology"
                location="Sweden"
            >
                <li>Designed and delivered a graduate-level training course on GC-MS Analytical Chromatography for over 50 PhD students.</li>
            </ExperienceBlock>
             <ExperienceBlock
                period="Sept. 2012 – Jun. 2013"
                title="Senior Lecturer"
                institution="Kazan Innovative University (KIU-IEML)"
                location="Russia"
            >
                <li>Taught laboratory and lecture courses in Food Chemistry, General Chemistry, Physical Chemistry, and Analytical Chemistry to undergraduate students.</li>
            </ExperienceBlock>
             <ExperienceBlock
                period="2008 – Present"
                title="Research Supervisor / Mentor"
                institution="Various Institutions (UU, KAUST, KU Leuven, KFU)"
                location="International"
            >
                <li>Supervised 8 undergraduate and 1 Master’s research projects to successful completion.</li>
                <li>Mentored visiting student interns in experimental design, data analysis, and laboratory techniques.</li>
            </ExperienceBlock>
             <ExperienceBlock
                period="Dec 2011 – Jul 2015 (PhD Period)"
                title="Junior Researcher / Project Engineer"
                institution="Kazan Federal University (KFU)"
                location="Russia"
            >
                <li>Designed and synthesized thiacalix[4]arene-based receptors and functionalized nanoparticles for the fabrication of electrochemical biosensors.</li>
                <li>Investigated host-guest interactions and molecular recognition phenomena using UV-Vis and fluorescence spectroscopy.</li>
            </ExperienceBlock>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4">Education</h2>
        <div className="py-2">
          <p className="text-sm text-gray-700">2015</p>
          <h3 className="text-lg font-semibold text-gray-900">PhD, Organic Chemistry</h3>
          <p className="text-md text-gray-800">Kazan Federal University, Kazan, Russia</p>
          <p className="mt-1 text-sm italic text-gray-700">Focus: Synthesis & Properties of Functionalized Supramolecular Systems.</p>
        </div>
      </section>

       <section className="mt-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4">Selected Publications</h2>
        <ul className="space-y-3 text-sm text-gray-800 list-disc list-outside ml-4">
            <li>
              Fan, Z.; Zamudio, E.; Liu, Y.; Laborda, E.; Tillo, A.; <strong>Sitdikov, R.</strong>; Crespo, G. A.; Cuartero, M. "Adamantane Os(II) dissolved redox probe as an efficient ion-to-electron transducer for voltammetric ionophore-based sensing." <em>Sensors and Actuators B: Chemical</em>, <strong>2025</strong>. <a href="https://doi.org/10.1016/j.snb.2025.138359" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">[DOI]</a>
            </li>
            <li>
              Li, N.; <strong>Sitdikov, R.</strong>; Kale, A. P.; Steverlynck, J.; Li, B.; Rueping, M. "A review of recent advances in electrochemical and photoelectrochemical late-stage functionalization..." <em>Beilstein Journal of Organic Chemistry</em>, <strong>2024</strong>. <a href="https://doi.org/10.3762/bjoc.20.214" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">[DOI]</a>
            </li>
            <li>
              Steverlynck, J.; <strong>Sitdikov, R.</strong>; Rueping, M.; Nikolaienko, P.; Kale, A. P. "Trideuteromethylation of Alkyl and Aryl Bromides by Nickel-Catalyzed Electrochemical Reductive Cross-Electrophile Coupling." <em>Synlett</em>, <strong>2024</strong>. <a href="https://doi.org/10.1055/s-0042-1751558" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">[DOI]</a>
            </li>
            <li>
              Mattsson, I.; Lahtinen, M.; <strong>Sitdikov, R.R.</strong>, et al. "Phase-selective low molecular weight organogelators derived from allylated d-mannose." <em>Carbohydrate Research</em>, <strong>2022</strong>. <a href="https://doi.org/10.1016/j.carres.2022.108596" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">[DOI]</a>
            </li>
            <li>
              Mattsson, I.; <strong>Sitdikov, R.</strong>; Gunell, A.C.M., et al. "Improved synthesis and application of conjugation-amenable polyols from d-mannose." <em>RSC Advances</em>, <strong>2020</strong>. <a href="https://doi.org/10.1039/c9ra10378c" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">[DOI]</a>
            </li>
        </ul>
        <p className="mt-4 text-sm text-gray-700">
          Full list available via <a href="https://orcid.org/0000-0002-1362-3819" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">ORCID</a> or <a href="https://scholar.google.com/citations?user=3sHiXqAAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">Google Scholar</a>.
        </p>
      </section>

    </div>
  );
}