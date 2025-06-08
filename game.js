// Elementos do DOM
        const fugitive = document.getElementById('fugitive');
        const scoreDisplay = document.getElementById('score');
        const timerDisplay = document.getElementById('timer');
        const highScoreDisplay = document.getElementById('high-score');
        const startScreen = document.getElementById('start-screen');
        const startBtn = document.getElementById('start-btn');

        // Configurações do jogo
        let score = 0;
        let timeLeft = 60;
        let gameActive = false;
        let highScore = localStorage.getItem('fugitiveHighScore') || 0;
        highScoreDisplay.textContent = `Recorde: ${highScore}`;
        let fugitiveActive = false;

        // Novas variáveis para estatísticas
        let captured = 0;
        let escaped = 0;
        let captureRanking = {}; // { nomePais: quantidade }
        let currentCountry = null;

        // Países com coordenadas
        const countries = [
            { name: "Argentina", x: 200, y: 370 },
            { name: "Brasil", x: 230, y: 310 },
            { name: "EUA", x: 80, y: 150 },
            { name: "Japão", x: 600, y: 180 },
            { name: "França", x: 450, y: 150 },
            { name: "Austrália", x: 700, y: 350 },
            { name: "Canadá", x: 220, y: 100 },
            { name: "Rússia", x: 550, y: 100 },
            { name: "China", x: 550, y: 200 },
            { name: "Índia", x: 500, y: 240 },
            { name: "África do Sul", x: 450, y: 380 },
        ];

        // Iniciar jogo
        startBtn.addEventListener('click', startGame);

        function startGame() {
            document.getElementById('game-container').style.height = '500px';
            document.getElementById('game-container').style.zIndex = '500';
            document.getElementById('start-screen').style.zIndex = '0';
            // Corrigido: Remover a tela de início
            startScreen.style.opacity = '0';
            setTimeout(() => {
                startScreen.classList.add('hidden');
            }, 500);
            
            gameActive = true;
            score = 0;
            timeLeft = 60;
            scoreDisplay.textContent = `Pontuação: ${score}`;
            timerDisplay.textContent = `Tempo: ${timeLeft}s`;
            fugitiveActive = false;
            captured = 0;
            escaped = 0;
            captureRanking = {};

            // Iniciar temporizador
            const timer = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Tempo: ${timeLeft}s`;
                
                if(timeLeft <= 0) {
                    clearInterval(timer);
                    endGame();
                }
            }, 1000);
            
            spawnFugitive();
        }

        function spawnFugitive() {
            if(!gameActive) return;

            const country = countries[Math.floor(Math.random() * countries.length)];
            currentCountry = country.name; // Salva o país atual
            fugitive.style.left = `${country.x - 25}px`;
            fugitive.style.top = `${country.y - 25}px`;
            fugitive.classList.remove('hidden');
            fugitiveActive = true;

            // Fugitivo desaparece após 1.5-3 segundos
            setTimeout(() => {
                if(!gameActive) return;
                if(!fugitive.classList.contains('hidden')) {
                    fugitive.classList.add('hidden');
                    fugitiveActive = false;
                    escaped++; // Incrementa fugitivos que escaparam
                    setTimeout(() => {
                        if(gameActive) spawnFugitive();
                    }, 300);
                }
            }, 1424 + Math.random() * 1512);
        }

        // Captura do fugitivo
        fugitive.addEventListener('click', captureFugitive);

        function captureFugitive() {
            if(!gameActive || !fugitiveActive) return;
            fugitiveActive = false;

            score++;
            captured++; // Incrementa capturados
            // Reproduzir som de captura aleatório
            const audioElements = Array.from(document.querySelectorAll('[id^="audio"]'));
            if (audioElements.length > 0) {
                const randomAudio = audioElements[Math.floor(Math.random() * audioElements.length)];
                randomAudio.currentTime = 0;
                randomAudio.play();
            }

            // Ranking de capturas por país
            if (currentCountry) {
                if (!captureRanking[currentCountry]) captureRanking[currentCountry] = 0;
                captureRanking[currentCountry]++;
            }

            scoreDisplay.textContent = `Pontuação: ${score}`;
            fugitive.classList.add('hidden');

            // Efeito visual
            // Use getBoundingClientRect para pegar a posição correta
            const rect = fugitive.getBoundingClientRect();
            const containerRect = document.getElementById('game-container').getBoundingClientRect();
            const x = rect.left - containerRect.left;
            const y = rect.top - containerRect.top;
            createParticles(x, y);

            setTimeout(spawnFugitive, 300);
            updateCombos();
        }
// combos
let lastComboImgSrc = null; // variável global para guardar o último src

function updateCombos() {
    const badgeContainer = document.getElementById('pn_bdgs');
    if (!badgeContainer) return;

    // Calcula quantos combos mostrar
    const badgeCount = Math.floor(score / 5);

    let newImgSrc;
    if (badgeCount > 0) {
        newImgSrc = `IMG/XND/xandao${badgeCount}s.png`;
    } else {
        newImgSrc = 'IMG/xandao.png';
    }

    // Só atualiza se a imagem mudou
    if (lastComboImgSrc !== newImgSrc) {
        badgeContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = newImgSrc;
        img.style.display = 'block';
        img.style.margin = '8px auto';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.animation = 'insertCombos 0.5s ease-in-out';
        badgeContainer.appendChild(img);
        lastComboImgSrc = newImgSrc;
        document.getElementById('aBlink').currentTime = 0; // Reseta o tempo do áudio
        document.getElementById('aBlink').play(); // Reproduz o áudio de combo
    }
}

// Chame updateBadges sempre que a pontuação mudar
        // Adicione esta linha ao final da função captureFugitive:
        updateCombos();
        // FIM combos

        function createParticles(x, y) {
            const particleCount = 25;
            const container = document.getElementById('game-container');
            
            for(let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.left = `${x + 20}px`;
                particle.style.top = `${y + 20}px`;
                particle.style.width = '8px';
                particle.style.height = '8px';
                particle.style.borderRadius = '50%';
                particle.style.background = '#90e0ef';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '15';
                particle.style.boxShadow = '0 0 10px #00b4d8';
                container.appendChild(particle);
                
                // Animar partículas
                const angle = Math.random() * Math.PI * 2;
                const speed = 3 + Math.random() * 4;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                
                animateParticle(particle, vx, vy);
            }
        }

        function animateParticle(particle, vx, vy) {
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            let opacity = 1;
            let size = 8;
            
            const animation = setInterval(() => {
                x += vx;
                y += vy;
                opacity -= 0.03;
                size -= 0.1;
                
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = opacity;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                if(opacity <= 0) {
                    clearInterval(animation);
                    particle.remove();
                }
            }, 30);
        }

        function endGame() {
            gameActive = false;
            fugitive.classList.add('hidden');
            document.getElementById('game-container').style.zIndex = '0';
            document.getElementById('start-screen').style.zIndex = '50';

            // Posicionar o Xandão
            const xandao = document.getElementById('pn_bdgs');
            xandao.style.position = 'absolute';
            xandao.style.right = '5%';
            xandao.style.top = '50%';
            xandao.style.transform = 'translate(0%, -50%)';
            xandao.style.zIndex = '1';
            xandao.style.display = 'block';
            xandao.style.width = '380px'; // Ajuste o tamanho conforme necessário
            xandao.style.height = '380px';
            xandao.style.background = 'none';
            // FIM posicionamento do Xandão

            // Atualizar recorde
            if(score > highScore) {
                highScore = score;
                localStorage.setItem('fugitiveHighScore', highScore);
                highScoreDisplay.textContent = `Recorde: ${highScore}`;
            }

            // Montar ranking ordenado
            const rankingArray = Object.entries(captureRanking)
                .sort((a, b) => b[1] - a[1])
                .map(([pais, qtd]) => `<li>${pais}: <b>${qtd}</b> captura${qtd>1?'s':''}</li>`)
                .join('');

            setTimeout(() => {
                startScreen.innerHTML = `<div class="game-over-container">
                    <h1 class="game-over-title">Fim de Jogo!</h1>
                    <p class="final-score">Pontuação Final: ${score}</p>
                    <p class="high-score">Recorde: ${highScore}</p>
                    <p class="final-score">Fugitivos Capturados: <b>${captured}</b></p><br>
                    <p class="final-score"><b>${escaped}</b> Fugitivos Escaparam</p>
                    
                    <div style="margin:20px 0;">
                        <h3 style="color:#00b4d8;">Ranking de Capturas por País</h3>
                        <ol style="text-align:left;max-width:300px;margin:0 auto;">
                            ${rankingArray || '<li>Nenhuma captura registrada</li>'}
                        </ol>
                    </div>
                    <button id="restart-btn" class="btn pulse">Jogar Novamente</button></div>
                `;
                startScreen.classList.remove('hidden');
                document.getElementById('game-container').style.height = '900px';
                startScreen.style.opacity = '1';

                document.getElementById('restart-btn').addEventListener('click', startGame);
            }, 1000);
        }

        // Configuração para offline (Service Worker)
        if('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                .catch(err => console.log("SW não registrado: ", err));
            });
        }
