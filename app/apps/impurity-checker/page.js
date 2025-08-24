"use client";

import React, { useEffect, useRef, useState } from 'react';

// This is a special component to safely load and use an external script like D3.js
const D3ScriptLoader = ({ children }) => {
    const [d3Loaded, setD3Loaded] = useState(false);

    useEffect(() => {
        if (window.d3) {
            setD3Loaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = "https://d3js.org/d3.v7.min.js";
        script.async = true;
        script.onload = () => setD3Loaded(true);
        document.body.appendChild(script);

        return () => {
            if (script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, []);

    if (!d3Loaded) {
        return <div className="text-center p-8">Loading Visualization Library...</div>;
    }

    return children;
};


export default function ImpurityCheckerPage() {
    return (
        <D3ScriptLoader>
            <ImpurityCheckerApp />
        </D3ScriptLoader>
    )
}

function ImpurityCheckerApp() {
    const drawBtnRef = useRef(null);
    const nmrDataInputRef = useRef(null);
    const expectedImpuritiesInputRef = useRef(null);
    const chartContainerRef = useRef(null);
    const messageAreaRef = useRef(null);
    const impuritySectionRef = useRef(null);
    const impurityListRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        const impurityData = {
            'CDCl3': [
                { name: 'Acetic acid', aliases: ['acetic acid'], shift: 2.10 }, { name: 'Acetone', aliases: ['acetone'], shift: 2.17 },
                { name: 'Acetonitrile', aliases: ['acetonitrile', 'mecn'], shift: 2.10 }, { name: 'Benzene', aliases: ['benzene'], shift: 7.36 },
                { name: 't-Butanol', aliases: ['tert-butanol', 'tbuoh'], shift: 1.28 }, { name: 'Chloroform', aliases: ['chloroform'], shift: 7.26 },
                { name: 'Cyclohexane', aliases: ['cyclohexane'], shift: 1.43 }, { name: '1,2-Dichloroethane', aliases: ['dce'], shift: 3.73 },
                { name: 'Dichloromethane', aliases: ['dcm'], shift: 5.30 }, { name: 'Diethyl ether', aliases: ['et2o', 'ether'], shift: 3.48 },
                { name: 'Diethyl ether', aliases: ['et2o', 'ether'], shift: 1.21 }, { name: 'DMF', aliases: ['dmf'], shift: 8.02 },
                { name: 'DMF', aliases: ['dmf'], shift: 2.96 }, { name: 'DMF', aliases: ['dmf'], shift: 2.88 }, { name: 'DMSO', aliases: ['dmso'], shift: 2.62 },
                { name: 'Dioxane', aliases: ['dioxane'], shift: 3.71 }, { name: 'Ethanol', aliases: ['etoh'], shift: 3.72 },
                { name: 'Ethanol', aliases: ['etoh'], shift: 1.25 }, { name: 'Ethyl acetate', aliases: ['etoac', 'ethylacetate'], shift: 2.05 },
                { name: 'Ethyl acetate', aliases: ['etoac', 'ethylacetate'], shift: 4.12 }, { name: 'Ethyl acetate', aliases: ['etoac', 'ethylacetate'], shift: 1.26 },
                { name: 'n-Heptane', aliases: ['heptane'], shift: 0.88 }, { name: 'n-Hexane', aliases: ['hexane', 'petroleum ether'], shift: 1.26 },
                { name: 'n-Hexane', aliases: ['hexane', 'petroleum ether'], shift: 0.88 }, { name: 'Methanol', aliases: ['meoh'], shift: 3.49 },
                { name: 'n-Pentane', aliases: ['pentane', 'petroleum ether'], shift: 1.27 }, { name: 'n-Pentane', aliases: ['pentane', 'petroleum ether'], shift: 0.88 },
                { name: 'Pyridine', aliases: ['pyridine'], shift: 8.62 }, { name: 'Pyridine', aliases: ['pyridine'], shift: 7.29 },
                { name: 'Pyridine', aliases: ['pyridine'], shift: 7.68 }, { name: 'THF', aliases: ['thf'], shift: 3.76 },
                { name: 'THF', aliases: ['thf'], shift: 1.85 }, { name: 'Toluene', aliases: ['toluene'], shift: 2.36 },
                { name: 'Toluene', aliases: ['toluene'], shift: 7.17 }, { name: 'tert-butyl methyl ether', aliases: ['mtbe'], shift: 3.22 },
                { name: 'tert-butyl methyl ether', aliases: ['mtbe'], shift: 1.19 }, { name: 'Water', aliases: ['h2o'], shift: 1.56 },
                { name: 'Grease', aliases: ['grease'], shift: 1.25 }, { name: 'Silicone grease', aliases: ['silicone'], shift: 0.07 }
            ],
            'DMSO': [
                { name: 'Acetic acid', aliases: ['acetic acid'], shift: 1.91 }, { name: 'Acetone', aliases: ['acetone'], shift: 2.09 },
                { name: 'Water', aliases: ['h2o'], shift: 3.33 }
            ],
        };
        const solventAliases = {
            'chloroform-d': 'CDCl3', 'cdcl3': 'CDCl3',
            'dmso-d6': 'DMSO', 'd6-dmso': 'DMSO',
        };

        const drawBtn = drawBtnRef.current;
        const nmrDataInput = nmrDataInputRef.current;
        const expectedImpuritiesInput = expectedImpuritiesInputRef.current;
        const chartContainer = chartContainerRef.current;
        const messageArea = messageAreaRef.current;
        const impuritySection = impuritySectionRef.current;
        const impurityList = impurityListRef.current;
        const tooltip = tooltipRef.current;
        const d3 = window.d3;

        const handleDrawClick = () => {
            const data = nmrDataInput.value;
            if (!data.trim()) {
                messageArea.textContent = 'Please enter NMR data.';
                messageArea.className = 'text-center text-red-500 font-medium mb-4 min-h-[1.5rem]';
                return;
            }
            const { signals, solvent } = parseNMRData(data);
            const expectedImpurities = expectedImpuritiesInput.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
            
            if (signals.length > 0) {
                let solventKey = solvent ? (solventAliases[solvent.toLowerCase()] || solvent.toUpperCase()) : null;
                if (solventKey && impurityData[solventKey]) {
                    messageArea.textContent = `Solvent detected: ${solvent}. Highlighting impurities.`;
                    messageArea.className = 'text-center text-green-600 font-medium mb-4 min-h-[1.5rem]';
                } else {
                    messageArea.textContent = `Solvent "${solvent}" not in database. Drawing spectrum only.`;
                    messageArea.className = 'text-center text-yellow-600 font-medium mb-4 min-h-[1.5rem]';
                    solventKey = null;
                }
                drawSpectrum(signals, solventKey, expectedImpurities);
            } else {
                messageArea.textContent = 'Could not parse data. Please check the format.';
                messageArea.className = 'text-center text-red-500 font-medium mb-4 min-h-[1.5rem]';
                chartContainer.innerHTML = ''; 
                impuritySection.classList.add('hidden');
            }
        };

        drawBtn.addEventListener('click', handleDrawClick);
        
        function parseNMRData(text) {
            const solventRegex = /\(\s*(?:[\d\.]+\s*MHz,\s*)?([\w-]+)\s*\)/i;
            const solventMatch = text.match(solventRegex);
            const solvent = solventMatch ? solventMatch[1].trim() : 'unknown';
            const dataString = text.replace(/1H-?NMR\s*\([^)]+\)\s*(d|δ)?/i, '').replace(/\n/g, ' ').replace(/–/g, '-').replace(/(\d),(\d)/g, '$1.$2');
            const signals = [];
            const signalRegex = /(-?\d+\.?\d*(?:\s*-\s*-?\d+\.?\d*)?)\s*\(([^)]+)\)/g;
            let match;
            while ((match = signalRegex.exec(dataString)) !== null) {
                try {
                    const shiftPart = match[1]; let detailsPart = match[2].trim();
                    const shiftValues = shiftPart.split('-').map(s => parseFloat(s.trim()));
                    const centerShift = shiftValues.reduce((a, b) => a + b, 0) / shiftValues.length;
                    const integrationMatch = detailsPart.match(/,?\s*([\d\.]+)\s*H\s*$/i);
                    if (!integrationMatch) continue;
                    const integration = parseFloat(integrationMatch[1]);
                    detailsPart = detailsPart.substring(0, integrationMatch.index);
                    const jValueMatch = detailsPart.match(/J\s*=\s*([\d\.\s,]+)\s*Hz/i);
                    const jValues = jValueMatch ? jValueMatch[1].split(/,|\s+/).filter(Boolean).map(parseFloat) : [];
                    if (jValueMatch) { detailsPart = detailsPart.substring(0, jValueMatch.index); }
                    const multiplicity = detailsPart.replace(/,/g, '').replace(/\s/g, '').trim();
                    if (!isNaN(centerShift) && multiplicity && !isNaN(integration)) {
                         signals.push({ centerShift, multiplicity, jValues, integration });
                    }
                } catch (e) { console.error("Could not parse signal chunk:", match[0], e); }
            }
            return { signals, solvent };
        }

        function findMatchingImpurity(shift, solventKey, expectedImpurities) {
            if (!solventKey || !impurityData[solventKey]) return null;
            const tolerance = 0.05;
            for (const impurity of impurityData[solventKey]) {
                if (Math.abs(shift - impurity.shift) <= tolerance) {
                    if (expectedImpurities && expectedImpurities.length > 0) {
                        const impurityNames = [impurity.name.toLowerCase(), ...(impurity.aliases || []).map(a => a.toLowerCase())];
                        const isExpected = expectedImpurities.some(expected => impurityNames.includes(expected));
                        if (isExpected) return impurity;
                    } else {
                        return impurity;
                    }
                }
            }
            return null;
        }

        function drawSpectrum(signals, solventKey, expectedImpurities) {
            chartContainer.innerHTML = ''; impurityList.innerHTML = '';
            let foundImpurities = [];
            const margin = { top: 20, right: 30, bottom: 40, left: 30 };
            const width = chartContainer.clientWidth - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;
            const svg = d3.select(chartContainer).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
            const minPPM = Math.min(-0.5, ...signals.map(s => s.centerShift)) - 0.2;
            const maxPPM = Math.max(10, ...signals.map(s => s.centerShift)) + 0.2;
            const xScale = d3.scaleLinear().domain([maxPPM, minPPM]).range([0, width]);
            const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
            
            const xAxis = d3.axisBottom(xScale).ticks(15);
            
            // CHANGED: We now select the axis group and explicitly style its text color.
            svg.append("g")
               .attr("transform", `translate(0,${height})`)
               .call(xAxis)
               .selectAll("text") // Select all the text elements within the axis
               .style("fill", "#4a5568"); // Set the fill color to gray-700
            
            // CHANGED: Added styling for the axis title
            svg.append("text")
                .attr("fill", "#2d3748") // Set fill to a dark gray
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 5) // Position it below the axis
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .text("Chemical Shift (δ / ppm)");

            const spectrometerFreq = 400;
            signals.forEach(signal => {
                const baseIntensity = 80;
                const peaks = generateMultiplet(signal.centerShift, signal.multiplicity, signal.jValues, baseIntensity, spectrometerFreq);
                const matchingImpurity = findMatchingImpurity(signal.centerShift, solventKey, expectedImpurities);
                peaks.forEach(peak => {
                    const peakWidthPPM = 0.01; const path = d3.path();
                    const startX = xScale(peak.ppm + peakWidthPPM); const endX = xScale(peak.ppm - peakWidthPPM);
                    const midX = xScale(peak.ppm); const topY = yScale(peak.intensity); const baseY = yScale(0);
                    path.moveTo(startX, baseY); path.quadraticCurveTo(midX, topY - (baseY - topY), endX, baseY);
                    const peakPath = svg.append("path").attr("d", path);
                    if (matchingImpurity) {
                        peakPath.attr("class", "impurity-peak");
                        peakPath.on('mouseover', (event) => {
                            d3.select(tooltip).style('opacity', .9).html(`${matchingImpurity.name}<br/>Ref: ${matchingImpurity.shift} ppm`).style('left', (event.pageX + 5) + 'px').style('top', (event.pageY - 28) + 'px');
                        }).on('mouseout', () => { d3.select(tooltip).style('opacity', 0); });
                    } else { peakPath.attr("class", "peak"); }
                });
                if (matchingImpurity) { foundImpurities.push({ signal, impurity: matchingImpurity }); }
                const signalGroupX = xScale(signal.centerShift);
                svg.append("text").attr("class", "integration-label").attr("x", signalGroupX).attr("y", yScale(baseIntensity) - 15).text(signal.integration + 'H');
            });
            if (foundImpurities.length > 0) {
                impuritySection.classList.remove('hidden');
                foundImpurities.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td class="px-4 py-2 whitespace-nowrap text-sm text-gray-800">${item.signal.centerShift.toFixed(2)}</td><td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-red-600">${item.impurity.name}</td><td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.impurity.shift.toFixed(2)}</td>`;
                    impurityList.appendChild(row);
                });
            } else { impuritySection.classList.add('hidden'); }
        }

        function generateMultiplet(center, mult, jValues, intensity, freq) {
            const jInPPM = jValues.map(j => j / freq); let peaks = [{ ppm: center, intensity: 1 }];
            const applySplitting = (currentPeaks, j, ratios) => {
                let newPeaks = [];
                currentPeaks.forEach(p => {
                    for (let i = 0; i < ratios.length; i++) {
                        const shift = (i - (ratios.length - 1) / 2) * j;
                        newPeaks.push({ ppm: p.ppm + shift, intensity: p.intensity * ratios[i] });
                    }
                }); return newPeaks;
            };
            if (mult.length > 1 && jInPPM.length > 0) {
                mult.split('').forEach((char, index) => {
                    const j = jInPPM[index] || jInPPM[0]; let ratios;
                    if (char === 'd') ratios = [1, 1]; else if (char === 't') ratios = [1, 2, 1]; else if (char === 'q') ratios = [1, 3, 3, 1]; else ratios = [1];
                    peaks = applySplitting(peaks, j, ratios);
                });
            } else {
                switch (mult) {
                    case 's': break; case 'd': peaks = applySplitting(peaks, jInPPM[0], [1, 1]); break;
                    case 't': peaks = applySplitting(peaks, jInPPM[0], [1, 2, 1]); break;
                    case 'q': peaks = applySplitting(peaks, jInPPM[0], [1, 3, 3, 1]); break;
                    case 'm':
                        const numPeaks = 5 + Math.floor(Math.random() * 4); const spread = (jInPPM[0] || 0.05);
                        peaks = Array.from({length: numPeaks}, (_, i) => ({ ppm: center - spread/2 + (i / (numPeaks-1)) * spread + (Math.random() - 0.5) * 0.01, intensity: 0.2 + Math.random() * 0.8 }));
                        break;
                }
            }
            const maxIntensity = Math.max(...peaks.map(p => p.intensity));
            return peaks.map(p => ({ ppm: p.ppm, intensity: (p.intensity / maxIntensity) * intensity }));
        }

        nmrDataInput.value = `1H NMR (400 MHz, Chloroform-d) δ 7.42 – 7.28 (m, 6H), 7.27 – 7.18 (m, 2H), 6.31 (dd, J = 11.7, 7.6 Hz, 1H), 5.85 (d, J = 11.5 Hz, 1H), 5.53 (dd, J = 15.6, 8.5 Hz, 2H), 5.42 (s, 1H), 4.92 (d, J = 9.3 Hz, 1H), 4.79 (s, 0H), 3.78 (s, 4H), 1.44 (s, 9H), 1.33 – 1.23 (m, 3H), 1.27 – 1.09 (m, 2H), 0.99 – 0.78 (m, 5H), 0.75 (s, 12H), -0.31 (s, 4H), -0.43 (s, 3H), -0.46 (d, J = 3.3 Hz, 1H).`;
        expectedImpuritiesInput.value = `Cyclohexane, THF`;
        handleDrawClick();

        return () => {
            drawBtn.removeEventListener('click', handleDrawClick);
        };
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">NMR Spectrum Impurity Checker</h1>
                    <p className="text-gray-500 mt-2">Paste your 1H-NMR data to visualize the spectrum and identify common impurities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="nmrData" className="block text-sm font-medium text-gray-700 mb-2">NMR Data Description:</label>
                        <textarea ref={nmrDataInputRef} id="nmrData" rows="8" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800" placeholder="e.g., 1H NMR (400 MHz, Chloroform-d) δ 7.42 – 7.28 (m, 6H), 1.44 (s, 9H)..."></textarea>
                    </div>
                    <div>
                        <label htmlFor="expectedImpurities" className="block text-sm font-medium text-gray-700 mb-2">Expected Impurities (optional, comma-separated):</label>
                        <textarea ref={expectedImpuritiesInputRef} id="expectedImpurities" rows="8" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 text-gray-800" placeholder="e.g., ethyl acetate, hexane, mtbe"></textarea>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <button ref={drawBtnRef} id="drawBtn" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                        Analyze Spectrum
                    </button>
                </div>
                
                <div ref={messageAreaRef} id="messageArea" className="text-center font-medium mb-4 min-h-[1.5rem]"></div>

                <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                    <div ref={chartContainerRef} id="spectrumChart"></div>
                    <div ref={tooltipRef} id="tooltip" className="tooltip"></div>
                </div>

                <div ref={impuritySectionRef} id="impuritySection" className="mt-6 hidden">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">Detected Potential Impurities</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observed Shift (ppm)</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probable Impurity</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Shift (ppm)</th>
                                </tr>
                            </thead>
                            <tbody ref={impurityListRef} id="impurityList" className="divide-y divide-gray-200">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}