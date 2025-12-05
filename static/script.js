let isAdmin = false;    // metti true se vuoi admin di default
                        // metti 11 in app.py CURRENT_DAY per novembre


// Contenuti già definiti nel template come 'contents'
function setAdminMode() {
    document.querySelectorAll(".box").forEach(box => {
        box.classList.remove("locked");
        box.onclick = () => openPopup(Number(box.innerText));
    });
}

// Se isAdmin è true all'avvio, abilitiamo subito i box
if (isAdmin) {
    setAdminMode();
}

// Funzione per abilitare admin tramite password
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

// Messaggio quando il giorno è bloccato
function showLockedMessage() {
    if (!isAdmin) {
        alert("AH, Voleviii! ti tocca aspettare il giorno giusto ;p");
    }
}

// Apertura del popup
function openPopup(day) {
    const popup = document.getElementById("popup");
    const data = contents[day];

    document.getElementById("popup-title").textContent = data.title;
    document.getElementById("popup-img").src = "/static/images/" + data.image; // verifica cartella

    const audio = document.getElementById("popup-audio");
    audio.src = "/static/audio/musica" + day + ".mp3"; // verifica cartella e nomi file
    audio.play().catch(e => console.log("Audio non riprodotto:", e));

    popup.classList.add("open");
}

// Chiusura del popup
function closePopup() {
    const popup = document.getElementById("popup");
    const audio = document.getElementById("popup-audio");
    audio.pause();
    popup.classList.remove("open");
}
