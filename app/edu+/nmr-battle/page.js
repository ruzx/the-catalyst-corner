"use client";

import { useEffect, useRef } from 'react';

export default function NMRShooterPage() {
    const gameCanvasRef = useRef(null);
    const spectrumCanvasRef = useRef(null);
    const scoreElRef = useRef(null);
    const levelElRef = useRef(null);
    const spectrumTitleElRef = useRef(null);
    const tooltipElRef = useRef(null);
    const tooltipTextElRef = useRef(null);
    const tooltipCloseBtnRef = useRef(null);
    const startScreenRef = useRef(null);
    const gameOverScreenRef = useRef(null);
    const startButtonRef = useRef(null);
    const restartButtonRef = useRef(null);
    const finalScoreElRef = useRef(null);
    const finalLevelElRef = useRef(null);

    useEffect(() => {
        if (typeof window.Tone === 'undefined') {
            console.error("Tone.js is not loaded. Sound will not work.");
            return;
        }

        const gameData = [
            // Your full gameData array...
            {
                type: '¹H',
                spectrumTitle: '¹H NMR Spectrum',
                peaks: [{ ppm: 2.2, multiplicity: 's' }],
                correctAnswer: { name: 'Acetone', structure: 'CH3-CO-CH3' },
                wrongAnswers: [
                    { name: 'Methane', structure: 'CH4', explanation: 'Methane (CH4) would show a singlet around 0.23 ppm, not 2.2 ppm.' },
                    { name: 'Ethanol', structure: 'CH3-CH2-OH', explanation: 'Ethanol has two signals (a triplet and a quartet), not a single singlet.' },
                    { name: 'Benzene', structure: 'C6H6', explanation: 'Benzene shows a singlet much further downfield, around 7.26 ppm.' }
                ],
                explanation: 'A singlet at ~2.2 ppm is characteristic of protons on a methyl group next to a carbonyl (ketone), like in Acetone (CH3COCH3).'
            },
            {
                type: '¹H',
                spectrumTitle: '¹H NMR Spectrum',
                peaks: [{ ppm: 9.8, multiplicity: 't' }, { ppm: 2.4, multiplicity: 'dt' }],
                correctAnswer: { name: 'Propanal', structure: 'CH3-CH2-CHO' },
                wrongAnswers: [
                    { name: 'Acetone', structure: 'CH3-CO-CH3', explanation: 'Acetone has only one type of proton, giving a singlet around 2.2 ppm.' },
                    { name: 'Propane', structure: 'CH3-CH2-CH3', explanation: 'Propane signals are all upfield (< 2 ppm). There is no signal in the aldehyde region.' },
                    { name: 'Propanol', structure: 'CH3-CH2-CH2-OH', explanation: 'Propanol lacks the characteristic aldehyde proton signal around 9-10 ppm.' }
                ],
                explanation: 'The signal at 9.8 ppm is a clear indicator of an aldehyde proton (-CHO). The other signals match the rest of the propyl chain.'
            },
            {
                type: '¹H',
                spectrumTitle: '¹H NMR Spectrum',
                peaks: [{ ppm: 7.26, multiplicity: 's' }],
                correctAnswer: { name: 'Benzene', structure: 'C6H6' },
                wrongAnswers: [
                    { name: 'Cyclohexane', structure: 'C6H12', explanation: 'Cyclohexane is an alkane; its signal is a singlet far upfield at ~1.44 ppm.' },
                    { name: 'Toluene', structure: 'C6H5-CH3', explanation: 'Toluene would have signals for the aromatic protons (~7 ppm) AND a singlet for the methyl group (~2.3 ppm).' },
                    { name: 'Phenol', structure: 'C6H5-OH', explanation: 'Phenol has aromatic signals and a separate, broad signal for the -OH proton.' }
                ],
                explanation: 'A single peak around 7.26 ppm is the classic signal for the six equivalent protons of a benzene ring.'
            },
            {
                type: '¹H',
                spectrumTitle: '¹H NMR Spectrum',
                peaks: [{ ppm: 1.2, multiplicity: 's' }],
                correctAnswer: { name: 't-Butanol', structure: '(CH3)3-C-OH' },
                wrongAnswers: [
                    { name: 'Isopropanol', structure: '(CH3)2-CH-OH', explanation: 'Isopropanol would show a doublet for the methyl groups and a septet for the CH proton.' },
                    { name: 'n-Butanol', structure: 'CH3(CH2)3OH', explanation: 'n-Butanol shows multiple complex signals, not a single large singlet.' },
                    { name: 'Diethyl ether', structure: 'CH3CH2-O-CH2CH3', explanation: 'Diethyl ether shows a triplet and a quartet.' }
                ],
                explanation: 'A large singlet at ~1.2 ppm is characteristic of the nine equivalent protons of a t-butyl group.'
            },
            {
                type: '¹³C',
                spectrumTitle: '¹³C NMR Spectrum',
                peaks: [{ ppm: 205, multiplicity: 's' }],
                correctAnswer: { name: 'Ketone Carbonyl', structure: 'C=O (Ketone)' },
                wrongAnswers: [
                    { name: 'Alkane Carbon', structure: 'C-C (Alkane)', explanation: 'Alkane carbons (CH3, CH2, etc.) appear far upfield, typically between 0-50 ppm.' },
                    { name: 'Alkyne Carbon', structure: 'C≡C (Alkyne)', explanation: 'Alkyne carbons are found in the 70-110 ppm range.' },
                    { name: 'Aromatic Carbon', structure: 'C (Aromatic)', explanation: 'Aromatic carbons appear in the 95-165 ppm range.' }
                ],
                explanation: 'A signal in the 185-225 ppm range is highly characteristic of a ketone carbonyl carbon.'
            },
            {
                type: '¹³C',
                spectrumTitle: '¹³C NMR Spectrum',
                peaks: [{ ppm: 170, multiplicity: 's' }],
                correctAnswer: { name: 'Carboxylic Acid Carbonyl', structure: 'C=O (Acid)' },
                wrongAnswers: [
                    { name: 'Ketone Carbonyl', structure: 'C=O (Ketone)', explanation: 'Ketone carbonyls are further downfield, typically >185 ppm.' },
                    { name: 'Alkene Carbon', structure: 'C=C (Alkene)', explanation: 'Alkene carbons are typically found between 110-150 ppm.' },
                    { name: 'Ester Carbonyl', structure: 'C=O (Ester)', explanation: 'Ester carbonyls are in a similar region (155-175 ppm), but Carboxylic Acid is the most general answer for this range.' }
                ],
                explanation: 'A signal in the 160-180 ppm range is characteristic of a carboxylic acid or ester carbonyl carbon.'
            },
            {
                type: '¹³C',
                spectrumTitle: '¹³C NMR Spectrum',
                peaks: [{ ppm: 30, multiplicity: 's' }],
                correctAnswer: { name: 'Alkane Carbon', structure: 'C-C (Alkane)' },
                wrongAnswers: [
                    { name: 'Aromatic Carbon', structure: 'C (Aromatic)', explanation: 'Aromatic carbons are much further downfield, in the 95-165 ppm range.' },
                    { name: 'Aldehyde Carbonyl', structure: 'C=O (Aldehyde)', explanation: 'Aldehyde carbonyls are very far downfield, in the 175-205 ppm range.' },
                    { name: 'Carbon with Halogen', structure: 'C-X (Halogen)', explanation: 'Carbons bonded to halogens are typically shifted downfield, often into the 35-110 ppm range depending on the halogen.' }
                ],
                explanation: 'A signal between 0-50 ppm is the typical region for saturated sp³ hybridized (alkane) carbons.'
            }
        ];

        const gameCanvas = gameCanvasRef.current;
        const ctx = gameCanvas.getContext('2d');
        const spectrumCanvas = spectrumCanvasRef.current;
        const specCtx = spectrumCanvas.getContext('2d');
        const scoreEl = scoreElRef.current;
        const levelEl = levelElRef.current;
        const spectrumTitleEl = spectrumTitleElRef.current;
        const tooltipEl = tooltipElRef.current;
        const tooltipTextEl = tooltipTextElRef.current;
        const tooltipCloseBtn = tooltipCloseBtnRef.current;
        const startScreen = startScreenRef.current;
        const gameOverScreen = gameOverScreenRef.current;
        const startButton = startButtonRef.current;
        const restartButton = restartButtonRef.current;
        const finalScoreEl = finalScoreElRef.current;
        const finalLevelEl = finalLevelElRef.current;

        let animationFrameId;
        let gameRunning = false;
        let score = 0;
        let level = 1;
        let baseSpeed = 0.6;
        let currentQuestion = {};
        let enemies = [];
        let projectiles = [];
        let player;

        const Tone = window.Tone;
        const synth = new Tone.Synth({ oscillator: { type: "square" } }).toDestination();
        const hitSynth = new Tone.MembraneSynth().toDestination();
        const wrongSynth = new Tone.FMSynth({
            harmonicity: 8, modulationIndex: 2, oscillator: { type: "sine" },
            envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.1 }
        }).toDestination();

        function resizeCanvas() {
            const container = gameCanvas.parentElement;
            if (!container) return;
            gameCanvas.width = container.clientWidth;
            gameCanvas.height = container.clientHeight;
            
            const specContainer = spectrumCanvas.parentElement;
            if (!specContainer) return;
            spectrumCanvas.width = specContainer.clientWidth;
            spectrumCanvas.height = 150;
        }

        function getRandom(min, max) {
            return Math.random() * (max - min) + min;
        }

        function renderStructureSVG(structureName) {
            const svgWidth = 120;
            const svgHeight = 60;
            let svgContent = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#00ff00" font-family="Roboto Mono">${structureName}</text>`;
            
            switch (structureName) {
                case 'C6H6':
                    svgContent = `<polygon points="60,10 90,30 90,60 60,80 30,60 30,30" fill="none" stroke="#00ff00" stroke-width="2"/><circle cx="60" cy="45" r="15" fill="none" stroke="#00ff00" stroke-width="2"/>`;
                    break;
                case 'CH3-CO-CH3':
                    svgContent = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#00ff00" font-family="Roboto Mono">CH₃-CO-CH₃</text>`;
                    break;
                case 'CH3-CH2-CHO':
                    svgContent = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#00ff00" font-family="Roboto Mono">CH₃CH₂CHO</text>`;
                    break;
            }

            return `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" class="structure-svg">${svgContent}</svg>`;
        }

        class Player {
            constructor() {
                this.width = 40; this.height = 20;
                this.x = gameCanvas.width / 2 - this.width / 2;
                this.y = gameCanvas.height - this.height - 10;
                this.color = '#00ff00';
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + this.height);
                ctx.lineTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height);
                ctx.closePath();
                ctx.fill();
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
            }
            update(mouseX) {
                this.x = mouseX - this.width / 2;
                if (this.x < 0) this.x = 0;
                if (this.x > gameCanvas.width - this.width) this.x = gameCanvas.width - this.width;
            }
        }

        class Projectile {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.width = 4; this.height = 15;
                this.speed = 8; this.color = '#ffff00';
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
            }
            update() { this.y -= this.speed; }
        }
        
        class Enemy {
            constructor(answer, initialX, initialY) {
                this.width = 130; this.height = 70;
                this.x = initialX;
                this.y = initialY;
                this.speed = baseSpeed * getRandom(0.8, 1.2);
                this.answer = answer;
                this.isCorrect = answer.name === currentQuestion.correctAnswer.name;
                this.isHighlighted = false;
                
                const structureSVG = renderStructureSVG(answer.structure);
                const fullSVGString = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; border: 2px solid #00ff00; border-radius: 8px; background-color: rgba(10, 10, 42, 0.7); display: flex; align-items: center; justify-content: center; box-sizing: border-box;">${structureSVG}</div></foreignObject></svg>`;
                const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fullSVGString.replace(/\s\s+/g, ' '));
                this.image = new Image();
                this.image.src = dataUrl;
            }
            draw() {
                if (this.image.complete && this.image.naturalHeight !== 0) {
                     ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                }
                if (this.isHighlighted) {
                    ctx.save();
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 3;
                    ctx.shadowColor = '#00ff00';
                    ctx.shadowBlur = 15;
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.restore();
                }
            }
            update() { this.y += this.speed; }
        }

        function draw() {
             ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
             ctx.shadowBlur = 0;
             player.draw();
             enemies.forEach(enemy => enemy.draw());
        }

        function drawSpectrum() {
            if (!currentQuestion.peaks) return;
            specCtx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
            const { type, peaks } = currentQuestion;
            const padding = 20;
            const chartWidth = spectrumCanvas.width - padding * 2;
            const chartHeight = spectrumCanvas.height - padding * 2;
            const yBase = spectrumCanvas.height - padding;
            const ppmMax = type === '¹H' ? 13 : 220;
            const ppmMin = 0;
            specCtx.strokeStyle = '#006400';
            specCtx.fillStyle = '#00ff00';
            specCtx.lineWidth = 1;
            specCtx.font = '10px Roboto Mono';
            specCtx.beginPath();
            specCtx.moveTo(padding, yBase);
            specCtx.lineTo(padding + chartWidth, yBase);
            specCtx.stroke();
            for (let i = ppmMax; i >= ppmMin; i -= (type === '¹H' ? 1 : 20)) {
                const x = padding + chartWidth - ((i - ppmMin) / (ppmMax - ppmMin)) * chartWidth;
                specCtx.beginPath();
                specCtx.moveTo(x, yBase);
                specCtx.lineTo(x, yBase + 5);
                specCtx.stroke();
                specCtx.fillText(i, x - 5, yBase + 15);
            }
            specCtx.fillText('ppm', padding + chartWidth - 15, yBase - 5);
            specCtx.strokeStyle = '#00ffff';
            specCtx.lineWidth = 1.5;
            peaks.forEach(peak => {
                const x = padding + chartWidth - ((peak.ppm - ppmMin) / (ppmMax - ppmMin)) * chartWidth;
                const peakHeight = chartHeight * 0.8;
                specCtx.beginPath();
                specCtx.moveTo(x, yBase);
                specCtx.lineTo(x, yBase - peakHeight);
                specCtx.stroke();
            });
        }
        
        // CHANGED: This function now uses a more robust method to generate enemies, preventing the bug.
        function nextQuestion() {
            // 1. Pick a random question. This will be our correct answer.
            let newQuestionIndex = Math.floor(Math.random() * gameData.length);
            currentQuestion = gameData[newQuestionIndex];

            spectrumTitleEl.textContent = currentQuestion.spectrumTitle;
            drawSpectrum();
            enemies = [];

            // 2. Create a pool of potential answers, starting with the guaranteed correct one.
            const enemyOptions = [currentQuestion.correctAnswer];
            
            // 3. Create a list of all possible answers from the entire gameData to use as distractors.
            const allPossibleAnswers = gameData.map(item => item.correctAnswer);

            // 4. Add 3 unique, random wrong answers (distractors) to our pool.
            while(enemyOptions.length < 4 && enemyOptions.length < allPossibleAnswers.length) {
                const randomIndex = Math.floor(Math.random() * allPossibleAnswers.length);
                const potentialDistractor = allPossibleAnswers[randomIndex];

                // Check if the distractor is not already in our options pool
                if (!enemyOptions.some(option => option.name === potentialDistractor.name)) {
                    // Add its full data object (including explanation, which is in the original question object)
                    const distractorData = gameData[randomIndex].correctAnswer;
                    const originalQuestion = gameData.find(q => q.correctAnswer.name === distractorData.name);
                    
                    enemyOptions.push({
                        name: distractorData.name,
                        structure: distractorData.structure,
                        explanation: originalQuestion ? `This is ${distractorData.name}. It doesn't match the spectrum.` : 'Incorrect choice.'
                    });
                }
            }

            // 5. Shuffle the final pool of 4 answers.
            for (let i = enemyOptions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [enemyOptions[i], enemyOptions[j]] = [enemyOptions[j], enemyOptions[i]];
            }

            // 6. Spawn the enemies using the guaranteed non-overlapping lane system.
            const enemyWidth = 130;
            const numEnemies = enemyOptions.length;
            if (numEnemies === 0) return;

            const laneWidth = gameCanvas.width / numEnemies;
            let laneIndexes = Array.from(Array(numEnemies).keys());

            enemyOptions.forEach((answer, index) => {
                const laneIndex = laneIndexes[index];
                const laneCenter = (laneIndex * laneWidth) + (laneWidth / 2);
                let initialX = laneCenter - (enemyWidth / 2);
                const initialY = -70 - getRandom(0, 150); 
                initialX = Math.max(0, initialX);
                initialX = Math.min(initialX, gameCanvas.width - enemyWidth);

                enemies.push(new Enemy(answer, initialX, initialY));
            });
        }

        function updateScore(points) {
            score += points;
            scoreEl.textContent = score;
            if (score > 0 && score % 50 === 0 && level < 10) {
                level++;
                levelEl.textContent = level;
                baseSpeed += 0.2;
            }
        }
        
        function handleCorrectAnswer() {
            hitSynth.triggerAttackRelease("C4", "8n");
            updateScore(10);
            projectiles = [];
            nextQuestion();
        }
        
        function handleWrongAnswer(enemy) {
            wrongSynth.triggerAttackRelease("A2", "4n");
            gameRunning = false;

            const correctEnemy = enemies.find(e => e.isCorrect);
            if (correctEnemy) {
                correctEnemy.isHighlighted = true;
            }
            
            draw();

            tooltipTextEl.textContent = enemy.answer.explanation || 'That is not the correct structure.';
            tooltipEl.classList.remove('hidden');
        }
        
        function gameLoop() {
            if (!gameRunning) {
                cancelAnimationFrame(animationFrameId);
                return;
            }
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            ctx.shadowBlur = 0;
            player.draw();
            projectiles.forEach((p, pIndex) => {
                p.update();
                p.draw();
                if (p.y < 0) projectiles.splice(pIndex, 1);
            });
            enemies.forEach((enemy, eIndex) => {
                enemy.update();
                enemy.draw();
                if (enemy.y > gameCanvas.height) {
                    if (enemy.isCorrect) gameOver();
                    enemies.splice(eIndex, 1);
                }
                projectiles.forEach((p, pIndex) => {
                    if (p.x < enemy.x + enemy.width && p.x + p.width > enemy.x && p.y < enemy.y + enemy.height && p.y + p.height > enemy.y) {
                        if (enemy.isCorrect) handleCorrectAnswer();
                        else handleWrongAnswer(enemy);
                        projectiles.splice(pIndex, 1);
                        enemies.splice(eIndex, 1);
                    }
                });
            });
            animationFrameId = requestAnimationFrame(gameLoop);
        }
        
        function startGame() {
            startScreen.classList.add('hidden');
            gameOverScreen.classList.add('hidden');
            score = 0; level = 1; baseSpeed = 0.6;
            scoreEl.textContent = score;
            levelEl.textContent = level;
            player = new Player();
            projectiles = [];
            enemies = [];
            nextQuestion();
            gameRunning = true;
            gameLoop();
        }
        
        function gameOver() {
            gameRunning = false;
            cancelAnimationFrame(animationFrameId);
            finalScoreEl.textContent = score;
            finalLevelEl.textContent = level;
            gameOverScreen.classList.remove('hidden');
        }

        const handleResize = () => { resizeCanvas(); if(gameRunning) { drawSpectrum(); if(player) player.y = gameCanvas.height - player.height - 10; } };
        const handleMouseMove = (e) => { if (player && gameRunning) { const rect = gameCanvas.getBoundingClientRect(); player.update(e.clientX - rect.left); } };
        const handleCanvasClick = () => { if (gameRunning) { synth.triggerAttackRelease("C5", "16n"); projectiles.push(new Projectile(player.x + player.width / 2 - 2, player.y)); } };
        const handleTooltipClose = () => { tooltipEl.classList.add('hidden'); gameOver(); };
        const handleStartGame = () => { Tone.start().then(startGame); };

        window.addEventListener('resize', handleResize);
        gameCanvas.addEventListener('mousemove', handleMouseMove);
        gameCanvas.addEventListener('click', handleCanvasClick);
        tooltipCloseBtn.addEventListener('click', handleTooltipClose);
        startButton.addEventListener('click', handleStartGame);
        restartButton.addEventListener('click', handleStartGame);

        resizeCanvas();

        return () => {
            window.removeEventListener('resize', handleResize);
            gameCanvas.removeEventListener('mousemove', handleMouseMove);
            gameCanvas.removeEventListener('click', handleCanvasClick);
            tooltipCloseBtn.removeEventListener('click', handleTooltipClose);
            startButton.removeEventListener('click', handleStartGame);
            restartButton.removeEventListener('click', handleStartGame);
            cancelAnimationFrame(animationFrameId);
        };
        
    }, []);

    return (
        <div className="w-full h-screen bg-[#0a0a2a] flex items-center justify-center p-4">
            <div id="game-wrapper" className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 h-full lg:h-auto lg:max-h-[90vh]">
                <div className="flex-grow game-container rounded-lg p-2 h-1/2 lg:h-auto">
                    <canvas ref={gameCanvasRef} id="gameCanvas" className="w-full h-full"></canvas>
                </div>
                <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-4">
                    <div className="hud bg-black bg-opacity-50 border border-green-500 rounded-lg p-4 text-center">
                        <h2 className="text-2xl mb-2">SCORE: <span ref={scoreElRef} id="score">0</span></h2>
                        <h3 className="text-xl">LEVEL: <span ref={levelElRef} id="level">1</span></h3>
                    </div>
                    <div className="spectrum-container bg-black bg-opacity-50 border border-green-500 rounded-lg p-2">
                        <h3 ref={spectrumTitleElRef} id="spectrum-title" className="text-center text-lg font-bold mb-2">¹H NMR Spectrum</h3>
                        <canvas ref={spectrumCanvasRef} id="spectrumCanvas" className="w-full h-48 rounded-md"></canvas>
                    </div>
                </div>
            </div>

            <div ref={tooltipElRef} id="tooltip" className="tooltip hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg text-white max-w-md text-center">
                <h3 className="text-2xl text-red-500 font-bold mb-2">INCORRECT</h3>
                <p ref={tooltipTextElRef} id="tooltip-text" className="text-lg"></p>
                <button ref={tooltipCloseBtnRef} id="tooltip-close" className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md">Continue</button>
            </div>

            <div ref={startScreenRef} id="start-screen" className="start-screen absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
                <h1 className="text-6xl font-bold mb-4 text-green-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>NMR Alien Shooter</h1>
                <p className="text-xl mb-8 max-w-2xl">An NMR spectrum will be displayed. Enemy ships carrying chemical structures will fly by. Your mission is to shoot the ship with the structure that matches the spectrum.</p>
                <p className="text-lg mb-8">Use your <span className="text-yellow-400">MOUSE</span> to aim and <span className="text-yellow-400">CLICK</span> to shoot.</p>
                <button ref={startButtonRef} id="start-button" className="btn-start text-white font-bold py-4 px-8 rounded-lg text-3xl">START GAME</button>
            </div>

            <div ref={gameOverScreenRef} id="game-over-screen" className="hidden absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
                <h1 className="text-6xl font-bold mb-4 text-red-500" style={{ fontFamily: "'Orbitron', sans-serif" }}>GAME OVER</h1>
                <p className="text-3xl mb-4">Final Score: <span ref={finalScoreElRef} id="final-score" className="text-yellow-400">0</span></p>
                <p className="text-3xl mb-8">Level Reached: <span ref={finalLevelElRef} id="final-level" className="text-yellow-400">1</span></p>
                <button ref={restartButtonRef} id="restart-button" className="btn-start text-white font-bold py-4 px-8 rounded-lg text-3xl">RESTART</button>
            </div>
        </div>
    );
}