let selectedAI = null;
let VOICES = [];

const MIA_PREFERRED = ["Samantha", "Google UK English Female", "Microsoft Aria Online (Natural) - English (United States)"];
const BRIAN_PREFERRED = ["Daniel", "Google UK English Male", "Microsoft Guy Online (Natural) - English (United States)"];

function refreshVoices(){ VOICES = speechSynthesis.getVoices(); }
speechSynthesis.onvoiceschanged = refreshVoices; refreshVoices();

function pickVoice(list){
  for(const name of list){
    const v = VOICES.find(v => v.name.includes(name));
    if(v) return v;
  }
  return VOICES[0];
}

function speakWithAssistant(ai, text){
  const msg = new SpeechSynthesisUtterance(text);
  if(ai==="MIA"){
    msg.voice = pickVoice(MIA_PREFERRED);
    msg.pitch = 1.15; msg.rate = 1.0;
  } else {
    msg.voice = pickVoice(BRIAN_PREFERRED);
    msg.pitch = 0.95; msg.rate = 1.0;
  }
  speechSynthesis.speak(msg);
}

function selectAI(ai){
  selectedAI = ai;
  document.getElementById("selectedAI").innerText = "Selected: " + ai;
  speakWithAssistant(ai, ai + " systems online.");
}

function startTimer(){
  if(!selectedAI){
    alert("Please select MIA or BRIAN first.");
    return;
  }
  let time = parseInt(document.getElementById("seconds").value);

  speakWithAssistant(selectedAI, "Timer starting for " + time + " seconds.");

  const interval = setInterval(()=>{
    document.getElementById("countdown").innerText = time + " seconds remaining";
    time--;
    if(time < 0){
      clearInterval(interval);
      document.getElementById("countdown").innerText = "Time's up!";
      speakWithAssistant(selectedAI, "Timer complete. Well done.");
    }
  },1000);
}
