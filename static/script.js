let isAdmin = false;
if (isAdmin){
    setAdminMode();
}
let catchInterval; // Usato per il gioco del salto

function setAdminMode() {
    document.querySelectorAll(".box").forEach(box => {
        box.classList.remove("locked");
        box.onclick = () => openPopup(Number(box.innerText));
    });
}

function enableAdmin() {
    const pass = prompt("Password admin:");
    if (pass === "tette69") {
        isAdmin = true;
        setAdminMode();
        alert("Modalità admin attivata!");
    } else {
        alert("EH NO");
    }
}

function showLockedMessage() {
    if (!isAdmin) alert("AH, Voleviii! ti tocca aspettare il giorno giusto ;p");
}

function openPopup(day) {
    const popup = document.getElementById("popup");
    const data = contents[day];
    const gameContainer = document.getElementById("game-container");
    const imgElement = document.getElementById("popup-img");

    document.getElementById("popup-title").textContent = data.title;
    gameContainer.innerHTML = ""; 
    
    imgElement.src = "/static/images/" + data.image;
    imgElement.style.display = "block";

    const audio = document.getElementById("popup-audio");
    audio.src = "/static/audio/musica" + day + ".mp3";
    audio.play().catch(e => console.log("Audio non riprodotto"));

    // Avvio Giochi
    if (data.game === "memory") {
        startMemoryGame();
    } else if (data.game === "catch") {
        startJumpingGame(); // Chiamiamo la nuova funzione
    }

    popup.classList.add("open");
}

function closePopup() {
    const popup = document.getElementById("popup");
    const audio = document.getElementById("popup-audio");
    audio.pause();
    audio.currentTime = 0;
    
    // Fermiamo tutti i processi del gioco
    isGameOver = true; 
    clearTimeout(catchInterval);
    document.querySelectorAll(".obstacle").forEach(o => o.remove());
    
    popup.classList.remove("open");
}

// --- GIOCO 1: MEMORY CON CUORI E SENZA ALERT ---
function startMemoryGame() {
    const container = document.getElementById("game-container");
    const photoFiles = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg', 'foto5.jpg', 'foto6.jpg', 'foto7.jpg', 'foto8.jpg'];
    const cards = [...photoFiles, ...photoFiles].sort(() => 0.5 - Math.random());
    
    let flippedCards = [];
    let canFlip = false;
    let lives = 5;

    // Setup area cuoricini e contenitore messaggi
    container.innerHTML = `
        <div id="lives-container" style="width:100%; margin-bottom:15px; font-size:1.5rem; display:flex; justify-content:center; gap:5px;">
            ${'<span class="heart" style="color:red; transition:all 0.3s; display:inline-block;">❤️</span>'.repeat(lives)}
        </div>
        <div id="memory-wrapper" style="position:relative; display:flex; justify-content:center; flex-wrap:wrap; gap:8px;">
            <div id="memory-grid" style="display:flex; justify-content:center; flex-wrap:wrap; gap:8px; width:100%;"></div>
            
            <div id="memory-msg-fail" style="display:none; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; background:rgba(231, 76, 60, 0.9); padding:20px; border-radius:12px; font-weight:bold; z-index:100; text-align:center; width:80%;">
                CUORI FINITI! 💔<br><small>uff riprova</small>
            </div>
            
            <div id="memory-msg-win" style="display:none; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; background:rgba(46, 204, 113, 0.9); padding:20px; border-radius:12px; font-weight:bold; z-index:100; text-align:center; width:80%;">
                COMPLETATO! ✨🎄<br>Sei proprio topa anche in queste foto!
            </div>
        </div>
    `;

    const grid = document.getElementById("memory-grid");
    const hearts = container.querySelectorAll(".heart");
    const msgFail = document.getElementById("memory-msg-fail");
    const msgWin = document.getElementById("memory-msg-win");

    cards.forEach(imgName => {
        const card = document.createElement("div");
        card.classList.add("memory-card");
        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">?</div>
                <div class="memory-card-back">
                    <img src="/static/images/memory/${imgName}">
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // ANTEPRIMA DI 5 SECONDI
    setTimeout(() => {
        document.querySelectorAll('.memory-card').forEach(c => c.classList.add('flipped'));
        setTimeout(() => {
            document.querySelectorAll('.memory-card').forEach(c => c.classList.remove('flipped'));
            canFlip = true;
            setupMemoryClicks();
        }, 7000); 
    }, 500);

    function setupMemoryClicks() {
        document.querySelectorAll('.memory-card').forEach(card => {
            card.onclick = function() {
                if (!canFlip || this.classList.contains('flipped') || flippedCards.length >= 2) return;
                
                this.classList.add('flipped');
                flippedCards.push(this);

                if (flippedCards.length === 2) {
                    if (flippedCards[0].querySelector('img').src === flippedCards[1].querySelector('img').src) {
                        flippedCards = [];
                        checkMemoryWin();
                    } else {
                        canFlip = false;
                        
                        // Logica perdita cuore
                        lives--;
                        const heartToBreak = hearts[lives];
                        heartToBreak.style.filter = "grayscale(1)";
                        heartToBreak.style.opacity = "0.4";
                        heartToBreak.innerHTML = "💔";
                        heartToBreak.style.transform = "scale(0.8) translateY(5px)";

                        if (lives <= 0) {
                            // SCONFITTA SENZA ALERT
                            msgFail.style.display = "block";
                            canFlip = false;
                            setTimeout(() => {
                                startMemoryGame(); // Riavvio automatico
                            }, 3000);
                        } else {
                            setTimeout(() => {
                                flippedCards.forEach(c => c.classList.remove('flipped'));
                                flippedCards = [];
                                canFlip = true;
                            }, 1000);
                        }
                    }
                }
            };
        });
    }

    function checkMemoryWin() {
        const totalFlipped = document.querySelectorAll('.memory-card.flipped').length;
        if (totalFlipped === cards.length) {
            // VITOTRIA SENZA ALERT
            msgWin.style.display = "block";
        }
    }
}

// --- GIOCO 2: JUMPING GAME (SALTO FOTO) ---
let isGameOver = false; 

function startJumpingGame() {
    isGameOver = false;
    const container = document.getElementById("game-container");
    const playerPhoto = "memory/foto1.jpg"; 

    // Layout con obiettivo a 23
    container.innerHTML = `
        <div id="game-info" style="margin-bottom:10px; font-weight:bold;">
            Punti: <span id="score-val">0</span> / <span style="color:#e74c3c;">Obiettivo: 23</span>
        </div>
        <div id="game-box" style="cursor:pointer;">
            <div id="player"><img src="/static/images/${playerPhoto}"></div>
            <div id="game-msg" style="display:none; position:absolute; top:40%; left:50%; transform:translate(-50%,-50%); color:white; background:rgba(231, 76, 60, 0.9); padding:15px; border-radius:10px; font-weight:bold; z-index:100; text-align:center; min-width:150px;">
                HAI PERSO!<br><small>Clicca per riprovare</small>
            </div>
            <div id="win-msg" style="display:none; position:absolute; top:40%; left:50%; transform:translate(-50%,-50%); color:white; background:rgba(46, 204, 113, 0.9); padding:15px; border-radius:10px; font-weight:bold; z-index:100; text-align:center;">
                OBIETTIVO RAGGIUNTO! 🎄✨
            </div>
        </div>
    `;

    const player = document.getElementById("player");
    const gameBox = document.getElementById("game-box");
    const scoreVal = document.getElementById("score-val");
    const gameMsg = document.getElementById("game-msg");
    const winMsg = document.getElementById("win-msg");
    
    let score = 0;
    let isJumping = false;

    // Funzione Salto
    const jump = () => {
        if (isJumping || isGameOver) return;
        isJumping = true;
        player.classList.add("jump-animation");
        setTimeout(() => {
            player.classList.remove("jump-animation");
            isJumping = false;
        }, 800);
    };

    // Input
    gameBox.onclick = (e) => { e.stopPropagation(); jump(); };
    document.onkeydown = (e) => { if(e.code === "Space") jump(); };

    // Funzione per generare un singolo ostacolo
    function spawnObstacle() {
        if (isGameOver) return;

        const obs = document.createElement("div");
        obs.className = "obstacle";
        obs.innerText = "🎄";
        
        // VELOCITÀ: 1.5 secondi per attraversare (molto rapido)
        obs.style.animation = "move-obstacle 1.8s linear";
        gameBox.appendChild(obs);

        // Controllo collisione specifico per questo albero
        let checkInterval = setInterval(() => {
            if (isGameOver) { clearInterval(checkInterval); return; }
            
            let pBottom = parseInt(window.getComputedStyle(player).getPropertyValue("bottom"));
            let oLeft = obs.offsetLeft;

            // Hitbox precisa
            if (oLeft > 40 && oLeft < 80 && pBottom < 40) {
                endGame();
                clearInterval(checkInterval);
            }
        }, 10);

        // Successo: l'albero ha superato il giocatore
        setTimeout(() => {
            clearInterval(checkInterval);
            if (obs.parentElement) {
                obs.remove();
                if (!isGameOver) {
                    score++;
                    scoreVal.innerText = score;
                    if (score === 23) {
                        winMsg.style.display = "block";
                    }
                }
            }
        }, 1500);

        // LOGICA MULTI-ALBERO: Genera il prossimo INDIPENDENTEMENTE
        // Ne spara uno nuovo ogni 0.7 - 1.2 secondi (possono essercene 2 a schermo)
        let nextSpawnTime = Math.random() * 800 + 700; 
        catchInterval = setTimeout(spawnObstacle, nextSpawnTime);
    }

    function endGame() {
        isGameOver = true;
        gameMsg.style.display = "block";
        clearTimeout(catchInterval);
        // Fermiamo le animazioni di tutti gli alberi presenti
        document.querySelectorAll(".obstacle").forEach(o => o.style.animationPlayState = "paused");

        setTimeout(() => {
            // Il gioco si resetta solo se l'utente clicca o dopo un breve tempo
            gameBox.onclick = () => startJumpingGame();
        }, 500);
    }

    // Avvio del primo ostacolo dopo un secondo
    setTimeout(spawnObstacle, 1000);
}