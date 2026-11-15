let playerName = "";
let currentStep = 0;
let waitingForName = false;
let gameStarted = false; 
let waitingForMinigame = false;
let minigameActive = false;
let playerCoins = 0;
let misses = 0;
let avatarX = 45;
let noteSpawner;
let gameLoop;
let songTimer;
let currentCustomer = "girl";

const dialogueLines = [
    "hello !! welcome to symphony street",
    "you will be working here as a street musician, trying your best to accomplish your dreams of becoming the next big star.",
    "satisfy the customer to earn money ...or risk losing everything",
    "enter the name of our future superstar:"
];

const startBtn = document.getElementById("start-btn");
const gameScene = document.getElementById("game-scene");
const dialogueText = document.getElementById("dialogue-text");
const nameSection = document.getElementById("name-section");
const nameInput = document.getElementById("name-input");
const submitNameBtn = document.getElementById("submit-name-btn");
const startPlayingBtn = document.getElementById("start-playing-btn");
const clickHint = document.getElementById("click-hint");
const littleGirl = document.getElementById("littleGirl");
const oldLady = document.getElementById("oldLady")
const cat = document.getElementById("cat");
const spiderman = document.getElementById("spiderman");
const dad = document.getElementById("dad");
const character = document.getElementById("character");
const coinTracker = document.getElementById("coin-tracker");
const coinCount = document.getElementById("coin-count");
const speechBubble = document.getElementById("speech-bubble");
const minigameScreen = document.getElementById("minigame-screen");
const playerAvatar = document.getElementById("player-avatar");
const notesContainer = document.getElementById("notes-container");
const missCountText = document.getElementById("miss-count");
const songAudio = document.getElementById("song-audio");

startBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    startBtn.classList.add("hidden");
    gameScene.classList.remove("hidden");
    gameStarted = true;
    dialogueText.textContent = dialogueLines[0];
});

gameScene.addEventListener("click", () => {
    if(!gameStarted || waitingForName) return;
    if (waitingForMinigame) {
        waitingForMinigame = false;
        startMinigame();
        return;
    }
    if (currentCustomer === "transitionToLady") {
        currentCustomer = "lady";
        littleGirl.classList.add("hidden");
        oldLady.classList.remove("hidden");
        dialogueText.textContent = "it's the anniversery of my husband's passing...would you be so kind and sing me the song he once sang for me?";
        waitingForMinigame = true;
        return;
    }
    else if (currentCustomer === "transitionToCat") {
        currentCustomer = "cat";
        oldLady.classList.add("hidden");
        cat.classList.remove("hidden");
        dialogueText.textContent = "meow meow meow meow meow meow (play me jazz mortal humans)";
        waitingForMinigame = true;
        return;
    }
     else if (currentCustomer === "transitionToSpiderMan") {
        currentCustomer = "spiderman";
        oldLady.classList.add("hidden");
        cat.classList.add("hidden");
        spiderman.classList.remove("hidden");
        dialogueText.textContent = "chasing crimanls down the street can be exhausting. mind lending me a hand? play some loud rock music to draw out these theives.";
        waitingForMinigame = true;
        return;
    }
     else if (currentCustomer === "transitionTodad") {
        currentCustomer = "dad";
        oldLady.classList.add("hidden");
        cat.classList.add("hidden");
        spiderman.classList.add("hidden");
        dad.classList.remove("hidden");
        dialogueText.textContent = "shhhh...please go to sleep *sigh* my daughter won't go to sleep. could you please play her a lullaby?";
        waitingForMinigame = true;
        return;
    }
    currentStep++;

    if (currentStep < dialogueLines.length) {
        dialogueText.textContent = dialogueLines[currentStep];
        if (currentStep == 3) {
            waitingForName = true;
            nameSection.classList.remove("hidden");
            clickHint.classList.add("hidden");
            nameInput.focus();
        }
    }
});

nameSection.addEventListener("click", (event) => {
    event.stopPropagation();
});

submitNameBtn.addEventListener("click", () => {
    const typedName = nameInput.value.trim();
    if (typedName !== "") {
        playerName = typedName;
        waitingForName = false;
        nameSection.classList.add("hidden");
        dialogueText.textContent = `welcome, ${playerName}!`;
        startPlayingBtn.classList.remove("hidden");
    }
});

nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submitNameBtn.click();
    }
});

startPlayingBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    startPlayingBtn.classList.add("hidden");
    coinTracker.classList.remove("hidden");
    character.classList.add("hidden");
    littleGirl.classList.remove("hidden");
    dialogueText.textContent = "*sob* hi, i got a really bad grade on my test...*sniffle* can you please play kpop demon hunters for me please?";
    clickHint.classList.remove("hidden");
    waitingForMinigame = true;
});

function startMinigame() {
    clearInterval(noteSpawner);
    clearInterval(gameLoop);
    clearTimeout(songTimer);
    minigameActive = true;
    misses = 0;
    missCountText.textContent = misses;
    avatarX = 45;
    playerAvatar.style.left = avatarX + "%";
    notesContainer.innerHTML = "";
    speechBubble.classList.add("hidden");
    minigameScreen.classList.remove("hidden");
if (currentCustomer === "girl"){
        songAudio.src = "Golden.m4a.mp4";
    } else if (currentCustomer === "lady") {
        songAudio.src = "coco.mp4";
    } else if (currentCustomer === "cat") {
        songAudio.src = "cat.mp4"; 
    } else if (currentCustomer === "spiderman") {
        songAudio.src = "spiderman.mp4";
    } else if (currentCustomer === "dad") {
        songAudio.src = "Lullaby.M4A.mp4"
    }
    songAudio.currentTime = 0;
    songAudio.play().catch((error) => {
        console.log("Audio play blocked or file missing:", error);
    });
    noteSpawner = setInterval(spawnNote, 900);
    gameLoop = setInterval(updateNotes, 20);
    songTimer = setTimeout(() => {
        if (minigameActive) {
            endMinigame(true);
        }
    }, 30000);
}

document.addEventListener("keydown", (event) => {
    if (!minigameActive) return;

    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        avatarX = Math.max(0, avatarX - 5); // Moves left, stops at 0%
        playerAvatar.style.left = avatarX + "%";
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        avatarX = Math.min(88, avatarX + 5); // Moves right, stops before edge
        playerAvatar.style.left = avatarX + "%";
    }
});

function spawnNote() {
    const note = document.createElement("div");
    note.classList.add("falling-note");
    note.textContent = "🎵";
    note.style.left = Math.floor(Math.random() * 88) + "%";
    note.style.top = "-40px";
    notesContainer.appendChild(note);
}
function updateNotes() {
    const notes = document.querySelectorAll(".falling-note");
    const avatarRect = playerAvatar.getBoundingClientRect();
    const screenRect = minigameScreen.getBoundingClientRect();

    notes.forEach((note) => {
        let currentTop = parseFloat(note.style.top);
        note.style.top = (currentTop + 5) + "px";
        const noteRect = note.getBoundingClientRect();
        if (
            noteRect.bottom >= avatarRect.top &&
            noteRect.top <= avatarRect.bottom &&
            noteRect.right >= avatarRect.left &&
            noteRect.left <= avatarRect.right
        ) {
            note.remove();
        }
        else if (noteRect.top > screenRect.bottom) {
            note.remove();
            misses++;
            missCountText.textContent = misses;
            if (misses > 3) {
                endMinigame(false);
            }
        }
    });
}
songAudio.addEventListener("ended", () => {
    if (minigameActive) {
        endMinigame(true);
    }
});
function endMinigame(didWin) {
    minigameActive = false;
    clearInterval(noteSpawner);
    clearInterval(gameLoop);
    clearTimeout(songTimer)
    songAudio.pause();
    songAudio.currentTime = 0;
    minigameScreen.classList.add("hidden");
    speechBubble.classList.remove("hidden");
    clickHint.classList.add("hidden");
    if (currentCustomer ==='girl') {
        if (didWin) {
            playerCoins += 10;
            coinCount.textContent = playerCoins;
            dialogueText.textContent = "thank you mr !! i'll be sure to try my hardest next time.";
        } else {
            dialogueText.textContent = "your never going to be as popular as the demon hunters.";
    }
    currentCustomer = "transitionToLady";
    clickHint.classList.remove("hidden");
    } else if (currentCustomer === "lady") {
        if (didWin) {
            playerCoins += 15;
            coinCount.textContent = playerCoins;
            dialogueText.textContent = "my goodness !! you brought back such beautiful memories of my late husband and i. i'll never be able to thank you enough but i'll always pray for your great fortune son.";
        } else {
            dialogueText.textContent = "don't fret. not everybody is destined to hold an instrument, and you definitely aren't. i should be glad my late husband will never have to hear such an abomination.";
        }
        currentCustomer = "transitionToCat";
        clickHint.classList.remove("hidden");
    } else if (currentCustomer === "cat") {
        if (didWin) {
            playerCoins += 5;
            coinCount.textContent = playerCoins;
            dialogueText.textContent = "meow meow meow meow meow meow (i suppose some humans possess skills worthy of myself!)";
        } else {
            dialogueText.textContent = "meow meow meow meow meow (you dare to leash such a monstrosity in my presence.)";
        }
        currentCustomer = "transitionToSpiderMan";
        clickHint.classList.remove("hidden");
        } else if (currentCustomer === "spiderman") {
        if (didWin) {
            playerCoins += 20; // Reward points for Spider-Man
            coinCount.textContent = playerCoins;
            dialogueText.textContent = "you did it !! the city is a safer place because of you. i'll be sure to come back.";
        } else {
            dialogueText.textContent = "i guess i'll be having to save the city from you as well.";
        }
        currentCustomer = "transitionTodad";
        clickHint.classList.remove("hidden");
        } else if (currentCustomer === "dad") {
        if (didWin) {
            playerCoins += 100; // Reward points for Spider-Man
            coinCount.textContent = playerCoins;
            dialogueText.textContent = "she's asleep finally...shush.";
        } else {
            dialogueText.textContent = "SHE'S CRYING EVEN MORE NOW !!!";
        }
    }
}