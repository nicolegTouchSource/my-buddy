let hunger = 50;
let happiness = 50;
let energy = 50;

function updateStats() {
  document.getElementById('hunger').textContent = hunger;
  document.getElementById('happiness').textContent = happiness;
  document.getElementById('energy').textContent = energy;
}

function feed() {
  hunger = Math.max(0, hunger - 10);
  happiness = Math.min(100, happiness + 5);
  updateStats();
}

function play() {
  happiness = Math.min(100, happiness + 10);
  energy = Math.max(0, energy - 15);
  updateStats();
}

function rest() {
  energy = Math.min(100, energy + 20);
  hunger = Math.min(100, hunger + 5);
  updateStats();
}

function decay() {
  hunger = Math.min(100, hunger + 2);
  happiness = Math.max(0, happiness - 1);
  energy = Math.max(0, energy - 1);
  updateStats();

  if (hunger >= 100 || happiness <= 0 || energy <= 0) {
    alert("Your pet needs better care!");
    clearInterval(gameLoop);
  }
}

updateStats();
const gameLoop = setInterval(decay, 3000);
