let currentAI = null;
let orb = document.getElementById("orb");
let aiLabel = document.getElementById("aiLabel");
let secondsInput = document.getElementById("seconds");
let countdownEl = document.getElementById("countdown");
let timerId = null;
let USER_NAME = localStorage.getItem("userName") || null;

let VOICES = [];
speechSynthesis.onvoiceschanged = () => {
    VOICES = speechSynthesis.getVoices();
};

// Voice profiles
const MIA_P = ["Aria", "Jenny", "Samantha", "Victoria", "Karen", "Google UK English Female"];
const BRIAN_P = ["Guy", "Christopher", "Daniel", "Tom", "Google UK English Male"];

// AI Presets
const PRESETS = {
    "Meditation (5m)": 300,
    "Water Break (1m)": 60,
    "Cool Down (3m)": 180,
    "Study Session (25m)": 1500,
    "Stretch Break (2m)": 120,
    "Brush Teeth (2m)": 120
};

// Ask for user name if not saved
function askName() {
    speak(currentAI, "I don’t believe we’ve been introduced. What shall I call you?");
    const name = prompt("AI: What should I call you?");
    if (name && name.trim() !== "") {
        USER_NAME = name.trim();
        localStorage.setItem("userName", USER_NAME);
        speak(currentAI, `Pleasure to meet you, ${USER_NAME}.`);
    } else {
        speak(currentAI, "No worries, I'll ask again later.");
    }
}

// Voice picker
function pick(list) {
    if (!VOICES.length) return null;
    for (const n of list) {
        const v = VOICES.find(v => v.name.includes(n));
        if (v) return v;
    }
    return VOICES[0];
}

// Speak function
function speak(ai, text) {
    const msg = new SpeechSynthesisUtterance(text);
    if (ai === "MIA") {
        msg.voice = pick(MIA_P);
        msg.pitch = 1.16;
        msg.rate = 0.98;
    } else {
        msg.voice = pick(BRIAN_P);
        msg.pitch = 0.95;
        msg.rate = 1.05;
    }
    orb.classList.add("talking");
    msg.onend = () => orb.classList.remove("talking");
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
}

// Switch AI buttons
document.querySelectorAll(".chip").forEach(btn =>
    btn.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentAI = btn.dataset.ai;
        aiLabel.textContent = "Selected: " + currentAI;

        document.getElementById("bioMIA").classList.toggle("show", currentAI === "MIA");
        document.getElementById("bioBRIAN").classList.toggle("show", currentAI === "BRIAN");

        let greeting = USER_NAME ?
            `Hello ${USER_NAME}, ${currentAI} systems online.` :
            `${currentAI} systems online.`;

        speak(currentAI, greeting);

        if (!USER_NAME) setTimeout(askName, 1500);
    })
);

// Timer logic
function startTimer(seconds) {
    clearInterval(timerId);
    let remaining = seconds;
    countdownEl.textContent = formatTime(remaining);

    timerId = setInterval(() => {
        remaining--;
        countdownEl.textContent = formatTime(remaining);

        if (remaining <= 0) {
            clearInterval(timerId);
            speak(currentAI, USER_NAME ? `Time's up, ${USER_NAME}!` : "Time's up!");
        }
    }, 1000);
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// Manual timer input
document.querySelectorAll(".pill").forEach(btn =>
    btn.addEventListener("click", () => {
        const seconds = btn.dataset.seconds;
        speak(currentAI, `Timer set for ${Math.round(seconds / 60)} minutes.`);
        startTimer(seconds);
    })
);

// Preset selector
const presetMenu = document.getElementById("presetMenu");
for (const [label, secs] of Object.entries(PRESETS)) {
    const option = document.createElement("option");
    option.value = secs;
    option.textContent = label;
    presetMenu.appendChild(option);
}

presetMenu.addEventListener("change", () => {
    const secs = presetMenu.value;
    if (secs > 0) {
        speak(currentAI, `Preset selected. Starting timer.`);
        startTimer(Number(secs));
    }
});
