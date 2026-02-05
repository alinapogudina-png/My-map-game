document.addEventListener('DOMContentLoaded', () => {
    const questions = [ /* ... 20 вопросов ... */ { question: "She ___ a doctor.", answers: ["is", "am", "are"], correct: 0 }, { question: "They ___ from Spain.", answers: ["is", "am", "are"], correct: 2 }, { question: "I ___ a student.", answers: ["is", "am", "are"], correct: 1 }, { question: "He ___ my brother.", answers: ["is", "am", "are"], correct: 0 }, { question: "We ___ happy.", answers: ["is", "am", "are"], correct: 2 }, { question: "You ___ late.", answers: ["is", "am", "are"], correct: 2 }, { question: "It ___ a sunny day.", answers: ["is", "am", "are"], correct: 0 }, { question: "My cat ___ black.", answers: ["is", "am", "are"], correct: 0 }, { question: "His parents ___ at home.", answers: ["is", "am", "are"], correct: 2 }, { question: "I ___ not tired.", answers: ["is", "am", "are"], correct: 1 }, { question: "___ you like ice cream?", answers: ["Do", "Does", "Is"], correct: 0 }, { question: "He ___ have a car.", answers: ["don't", "doesn't", "isn't"], correct: 1 }, { question: "What ___ your name?", answers: ["is", "are", "am"], correct: 0 }, { question: "How old ___ you?", answers: ["is", "are", "am"], correct: 1 }, { question: "Where ___ she live?", answers: ["do", "does", "is"], correct: 1 }, { question: "I can ___ very fast.", answers: ["run", "runs", "running"], correct: 0 }, { question: "She ___ to school every day.", answers: ["go", "goes", "is going"], correct: 1 }, { question: "There ___ a book on the table.", answers: ["is", "are", "am"], correct: 0 }, { question: "There ___ two cats.", answers: ["is", "are", "am"], correct: 1 }, { question: "___ are you from?", answers: ["What", "Who", "Where"], correct: 2 }];
    const artifactPositions = [ /* ... 20 позиций ... */ { top: '80%', left: '15%' }, { top: '85%', left: '85%' }, { top: '65%', left: '78%' }, { top: '70%', left: '50%' }, { top: '40%', left: '10%' }, { top: '55%', left: '30%' }, { top: '35%', left: '65%' }, { top: '85%', left: '35%' }, { top: '20%', left: '25%' }, { top: '50%', left: '90%' }, { top: '15%', left: '55%' }, { top: '75%', left: '5%' }, { top: '90%', left: '60%' }, { top: '5%', left: '40%' }, { top: '60%', left: '65%' }, { top: '30%', left: '85%' }, { top: '25%', left: '5%' }, { top: '45%', left: '45%' }, { top: '92%', left: '25%' }, { top: '5%', left: '75%' }];

    const footprintsContainer = document.getElementById('footprints-container');
    const collectedArtifactsPanel = document.getElementById('collected-artifacts-panel');
    const artifactsContainer = document.getElementById('artifacts-container');
    const startScreen = document.getElementById('start-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const gameContent = document.getElementById('game-content');
    const scoreCounter = document.getElementById('score-counter');
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const finalTarget = document.getElementById('final-target');
    const sounds = { correct: document.getElementById('correct-sound'), open: document.getElementById('chest-open-sound'), final: document.getElementById('final-target-sound'), wrong: document.getElementById('wrong-answer-sound') };

    let foundArtifacts = 0;
    let totalArtifacts = questions.length;
    let activeArtifactElement = null;
    
    function checkAnswer(isCorrect) {
        if (isCorrect) {
            playSound(sounds.correct);
            foundArtifacts++;
            scoreCounter.textContent = `${foundArtifacts} / ${totalArtifacts}`;
            collectArtifactAnimation();
            addFootprint();
            closeModal();
            if (foundArtifacts === totalArtifacts) {
                setTimeout(endGame, 1200);
            }
        } else {
            playSound(sounds.wrong);
            modal.classList.add('shake');
            setTimeout(() => modal.classList.remove('shake'), 500);
        }
    }

    function addFootprint() {
        const footprint = document.createElement('div');
        footprint.className = 'footprint';
        footprintsContainer.appendChild(footprint);
    }
    
    function endGame() {
        const footprints = Array.from(footprintsContainer.children);
        footprintsContainer.style.background = 'none';
        const finalTargetX_percent = 50;
        const finalTargetY_percent = 70;
        const pathPoints = [ { top: '40%', left: '10%' }, { top: '50%', left: '15%' }, { top: '60%', left: '20%' }, { top: '70%', left: '25%' }, { top: '80%', left: '30%' }, { top: '85%', left: '40%' }, { top: '88%', left: '50%' }, { top: '85%', left: '60%' }, { top: '80%', left: '70%' }, { top: '70%', left: '75%' }, { top: '60%', left: '80%' }, { top: '50%', left: '85%' }, { top: '40%', left: '80%' }, { top: '35%', left: '70%' }, { top: '40%', left: '60%' }, { top: '50%', left: '55%' }, { top: '60%', left: '52%' }, { top: '65%', left: '50%' }, { top: '68%', left: '52%' }, { top: '70%', left: '50%' } ];
        footprints.forEach((footprint, index) => {
            setTimeout(() => {
                const rect = footprint.getBoundingClientRect();
                footprint.style.position = 'absolute';
                footprint.style.top = `${rect.top}px`;
                footprint.style.left = `${rect.left}px`;
                document.getElementById('game-container').appendChild(footprint);
                footprint.classList.add('final-path-footprint');
                setTimeout(() => {
                    const point = pathPoints[index];
                    footprint.style.top = point.top;
                    footprint.style.left = point.left;
                    const footprintX = parseFloat(point.left);
                    const footprintY = parseFloat(point.top);
                    const deltaX = finalTargetX_percent - footprintX;
                    const deltaY = finalTargetY_percent - footprintY;
                    const angleRad = Math.atan2(deltaY, deltaX);
                    const angleDeg = angleRad * (180 / Math.PI);
                    footprint.style.transform = `rotate(${angleDeg + 90}deg)`;
                }, 50);
            }, index * 200);
        });
        setTimeout(() => {
            finalTarget.classList.remove('hidden');
            playSound(sounds.final);
        }, footprints.length * 200 + 1500);
    }

    // --- ЕДИНСТВЕННОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---
    function collectArtifactAnimation() {
        // Создаем локальную переменную, чтобы "запомнить" именно этот сундук
        const artifactToAnimate = activeArtifactElement;

        artifactToAnimate.removeEventListener('click', handleArtifactClick);
        artifactToAnimate.style.pointerEvents = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'collected-artifact';
        collectedArtifactsPanel.appendChild(placeholder);
        const targetRect = placeholder.getBoundingClientRect();
        const startRect = artifactToAnimate.getBoundingClientRect();
        artifactToAnimate.style.position = 'fixed';
        artifactToAnimate.style.top = `${startRect.top}px`;
        artifactToAnimate.style.left = `${startRect.left}px`;
        artifactToAnimate.style.zIndex = '2000';
        setTimeout(() => {
            artifactToAnimate.style.top = `${targetRect.top}px`;
            artifactToAnimate.style.left = `${targetRect.left}px`;
            artifactToAnimate.style.transform = 'scale(0.5)';
        }, 50);
        setTimeout(() => {
            // Удаляем именно тот сундук, который был "запомнен" в начале
            artifactToAnimate.remove();
        }, 1100);
    }
    
    // --- Остальной код без изменений ---
    function playSound(sound) { sound.currentTime = 0; sound.play(); }
    function startGame() { Object.values(sounds).forEach(sound => { sound.play().then(() => sound.pause()).catch(() => {}); }); startScreen.classList.add('hidden'); gameContent.classList.remove('hidden'); initGame(); }
    function initGame() { scoreCounter.textContent = `${foundArtifacts} / ${totalArtifacts}`; questions.forEach((_, index) => { const artifact = document.createElement('div'); artifact.className = 'artifact'; artifact.style.top = artifactPositions[index].top; artifact.style.left = artifactPositions[index].left; artifact.dataset.questionIndex = index; artifact.addEventListener('click', handleArtifactClick); artifactsContainer.appendChild(artifact); }); }
    function handleArtifactClick(event) { playSound(sounds.open); activeArtifactElement = event.target; openModal(activeArtifactElement.dataset.questionIndex); }
    function openModal(questionIndex) { const qd = questions[questionIndex]; questionText.textContent = qd.question; answersContainer.innerHTML = ''; qd.answers.forEach((ans, i) => { const btn = document.createElement('button'); btn.className = 'answer-btn'; btn.textContent = ans; btn.onclick = () => checkAnswer(i === qd.correct); answersContainer.appendChild(btn); }); modalOverlay.classList.remove('hidden'); }
    function closeModal() { modalOverlay.classList.add('hidden'); }
    startGameBtn.addEventListener('click', startGame);
});
