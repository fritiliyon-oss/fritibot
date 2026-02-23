// --- 1. Particles Background (Super Glow 🌟) ---
particlesJS("particles-js", {
    particles: {
        number: { value: 90 },
        color: { value: "#39ff14" },
        shape: { type: "circle" },
        opacity: { value: 0.6 },
        size: { value: 3 },
        line_linked: { enable: true, distance: 150, color: "#39ff14", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 3 }
    },
    interactivity: { events: { onhover: { enable: true, mode: "repulse" } } }
});

// --- 2. Dashboard Logic ---

const logBox = document.getElementById('log-box');

// Start Bot function
document.getElementById('start-btn').onclick = async () => {
    logBox.innerHTML += "<br>> <span style='color:#58a6ff'>Requesting server to start Beast...</span>";
    const res = await fetch('/api/start', { method: 'POST' });
    const data = await res.json();
    logBox.innerHTML += `<br>> <span style='color:#3fb950'>${data.msg}</span>`;
};

// Train Bot function
document.getElementById('train-btn').onclick = async () => {
    const input = document.getElementById('train-input');
    if (!input.value) return alert("Mokak hari type karapan ban!");

    logBox.innerHTML += `<br>> Teaching: ${input.value}`;
    const res = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ info: input.value })
    });
    const data = await res.json();
    logBox.innerHTML += `<br>> <span style='color:#a371f7'>${data.msg}</span>`;
    input.value = "";
};