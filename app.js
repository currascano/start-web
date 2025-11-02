// ======================
// S.T.A.R.L.I.G.H.T. Timer System
// Name Memory + Voice AI + Presets
// ======================

let currentAI = "MIA";
let userName = localStorage.getItem("userName") || null;

const orb = document.getElementById("orb");
const aiLabel = document.getElementById("aiLabel");
const secondsInput = document.getElementById("seconds");
const countdownEl = document.getElementById("countdown");
const presetMenu = document.getElementById("presetMenu");
let timerId = null;

// ===== VOICE =====
let VOICES = [];
speechSynthesis.onvoiceschanged = () => VOICES = speechSynthesis.getVoices();

const MIA_PREF = ["Aria", "Jenny", "Samantha", "Google UK English Female"];
const BRIAN_PREF = ["Guy", "Christopher", "Daniel", "Google UK English Male"];

function pick(list){
  if (!VOICES.length) return null;
  for (const name of list){
    const v = VOICES.find(v => v.name.includes(name));
    if (v) return v;
  }
  return VOICES[0];
}

function speak(ai, text){
  const u = new SpeechSynthesisUtterance(text);
  if (ai === "MIA"){ u.voice = pick(MIA_PREF); u.pitch = 1.15; u.rate = .97; }
  else { u.voice = pick(BRIAN_PREF); u.pitch = .95; u.rate = 1.03; }

  u.onstart = ()=> orb.classList.add("talking");
  u.onend = ()=> orb.classList.remove("talking");
  speechSynthesis.speak(u);
}

// ===== Ask for Name =====
async function requestUserName(){
  if (!userName){
    userName = prompt("Welcome. What shall we call you?");
    if (!userName) userName = "Operator";
    localStorage.setItem("userName", userName);
  }
  speak("MIA", `Hello ${userName}. Starlight systems online.`);
}
setTimeout(requestUserName, 800);

// ===== AI Switch =====
document.querySelectorAll(".chip").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active"); 
    currentAI = btn.dataset.ai;
    aiLabel.textContent = "Selected: " + currentAI;
    orb.className = currentAI === "MIA" ? "mia" : "brian";
    speak(currentAI, `Ready, ${userName}.`);
  };
});

// ===== Preset List =====
const presets = {
  "Meditation (5m)": 300,
  "Water Break (2m)": 120,
  "Study Session (25m)": 1500,
  "Brush Teeth (2m)": 120,
  "Cool Down (3m)": 180,
};

Object.entries(presets).forEach(([name, secs]) => {
  const o = document.createElement("option");
  o.value = secs;
  o.textContent = name;
  presetMenu.appendChild(o);
});

presetMenu.onchange = () => {
  if(presetMenu.value > 0){
    secondsInput.value = presetMenu.value;
    speak(currentAI, `Preset set: ${presetMenu.options[presetMenu.selectedIndex].text}`);
  }
};

// ===== Timer =====
document.getElementById("startBtn").onclick = () => {
  let t = parseInt(secondsInput.value) || 600;
  speak(currentAI, `Starting ${Math.floor(t/60)} minute session, ${userName}.`);
  clearInterval(timerId);
  
  function tick(){
    countdownEl.textContent = t > 0 ?
      `${Math.floor(t/60)}m ${t%60}s` :
      "Complete";
      
    if(t <= 0){
      clearInterval(timerId);
      speak(currentAI, `Session complete. Excellent work, ${userName}.`);
    }
    t--;
  }
  tick();
  timerId = setInterval(tick, 1000);
};

document.getElementById("stopBtn").onclick = () => {
  clearInterval(timerId);
  countdownEl.textContent = "Stopped.";
  speak(currentAI, `Timer stopped, ${userName}.`);
};
