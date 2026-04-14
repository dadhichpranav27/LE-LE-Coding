// ==========================
// ⚡ GLOBAL SPEED CONTROL
// ==========================
let baseSpeed = 150;


// ==========================
// 🔊 AUDIO BUFFER SYSTEM
// ==========================
const DOT_SOUND = "Le.mp3";
const DASH_SOUND = "yehle.mp3";

let audioCtx;
let dotBuffer = null;
let dashBuffer = null;


// 🔊 INIT AUDIO (UNLOCK + LOAD)
async function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // 🔥 Load only once
    if (!dotBuffer) dotBuffer = await loadSound(DOT_SOUND);
    if (!dashBuffer) dashBuffer = await loadSound(DASH_SOUND);
}


// 🔊 LOAD SOUND FILE
async function loadSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
}


// 🔊 PLAY SOUND
function playBuffer(type) {
    if (!audioCtx) return;

    const source = audioCtx.createBufferSource();

    source.buffer = (type === "dot") ? dotBuffer : dashBuffer;
    source.connect(audioCtx.destination);

    source.start();
}


// ==========================
// 📡 MORSE CODE MAP
// ==========================
const morse = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
    F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
    K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
    P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
    U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--",
    Z: "--..",
    " ": "/"
};


// ==========================
// 🌊 CREATE WAVE
// ==========================
function createWaveBars() {
    const wave = document.getElementById("wave");
    wave.innerHTML = "";

    for (let i = 0; i < 30; i++) {
        const bar = document.createElement("span");
        wave.appendChild(bar);
    }
}


// ==========================
// 🌊 WAVE ANIMATION
// ==========================
function animateWave(type) {
    const bars = document.querySelectorAll("#wave span");

    bars.forEach(bar => {
        let height;

        if (type === "dot") {
            height = Math.random() * 20 + 10;
        } else {
            height = Math.random() * 40 + 20;
        }

        bar.style.height = height + "px";
        bar.style.opacity = "1";
    });
}

function resetWave() {
    const bars = document.querySelectorAll("#wave span");

    bars.forEach(bar => {
        bar.style.height = "10px";
        bar.style.opacity = "0.3";
    });
}


// ==========================
// 🚀 START CONVERSION
// ==========================
async function startConversion() {
    await initAudio(); // 🔥 ensures audio is ready

    createWaveBars();

    const input = document.getElementById("userInput").value.toUpperCase();
    const display = document.getElementById("signalDisplay");

    display.innerHTML = "";

    let sequence = [];

    for (let char of input) {
        if (morse[char]) {
            sequence.push(morse[char]);
        }
    }

    playSequence(sequence.join(" "));
}


// ==========================
// ▶️ PLAY SEQUENCE
// ==========================
function playSequence(seq) {
    let i = 0;
    const display = document.getElementById("signalDisplay");

    function next() {
        if (i >= seq.length) {
            resetWave();
            return;
        }

        const symbol = seq[i];

        if (symbol === ".") {
            display.innerHTML += "●";
            playBuffer("dot");
            animateWave("dot");

            i++;
            setTimeout(next, baseSpeed);
        }
        else if (symbol === "-") {
            display.innerHTML += "▬";
            playBuffer("dash");
            animateWave("dash");

            i++;
            setTimeout(next, baseSpeed * 2);
        }
        else if (symbol === " ") {
            display.innerHTML += " ";
            i++;
            setTimeout(next, baseSpeed);
        }
        else if (symbol === "/") {
            display.innerHTML += "   ";
            i++;
            setTimeout(next, baseSpeed * 3);
        }
    }

    next();
}


// ==========================
// 🎛️ SPEED CONTROL
// ==========================
window.addEventListener("DOMContentLoaded", () => {
    const speedSlider = document.getElementById("speedSlider");
    const speedValueText = document.getElementById("speedValue");

    if (!speedSlider) return;

    speedSlider.addEventListener("input", () => {
        const sliderValue = parseInt(speedSlider.value);

        // 🔥 Reverse logic (natural feel)
        baseSpeed = 350 - sliderValue;

        if (speedValueText) {
            let label;

            if (sliderValue < 120) label = "Slow 🐢";
            else if (sliderValue < 220) label = "Normal ⚡";
            else label = "Fast 🚀";

            speedValueText.textContent = label;
        }
    });
});