let hunger = 50;
let happiness = 50;
let energy = 50;
let isResting = false;
let restInterval;
let movementInterval;

// Background cycling functionality
let currentBackgroundIndex = 0;
const backgroundImages = [
  'images/background1.jpg',
  'images/background2.jpg',
  'images/background3.jpg',
  'images/background4.jpg'
];

// Pet name functionality
function initializePetName() {
  const petNameElement = document.getElementById('pet-name');
  
  // Load saved name from localStorage or use default
  const savedName = localStorage.getItem('petName') || 'Emi';
  petNameElement.textContent = savedName;
  
  // Save name when user finishes editing
  petNameElement.addEventListener('blur', function() {
    const newName = this.textContent.trim() || 'Emi';
    this.textContent = newName;
    localStorage.setItem('petName', newName);
  });
  
  // Handle Enter key to finish editing
  petNameElement.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      this.blur();
    }
  });
  
  // Prevent line breaks
  petNameElement.addEventListener('paste', function(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    const cleanText = text.replace(/\n/g, ' ').trim();
    document.execCommand('insertText', false, cleanText);
  });
}

function updateStats() {
  updateStatusBar('hunger', hunger);
  updateStatusBar('happiness', happiness);
  updateStatusBar('energy', energy);
  updatePetAnimation();
  updateBowlState();
}

function updatePetAnimation() {
  const petImg = document.querySelector('#pet img');
  
  // Remove existing animation classes
  petImg.classList.remove('pet-happy', 'pet-normal', 'pet-sad');
  
  // If resting, use rest image and no animation
  if (isResting) {
    petImg.src = 'images/pet-rest.png';
    return;
  }
  
  // Update image and animation based on happiness level
  if (happiness >= 80) {
    petImg.src = 'images/pet-happy.png';
    petImg.classList.add('pet-happy');
  } else if (happiness >= 20) {
    petImg.src = 'images/pet-normal.png';
    petImg.classList.add('pet-normal');
  } else {
    petImg.src = 'images/pet-sad.png';
    petImg.classList.add('pet-sad');
  }
}

function updateStatusBar(statName, value) {
  const bar = document.getElementById(statName + '-bar');
  const text = document.getElementById(statName);
  
  // Update width
  bar.style.width = value + '%';
  
  // Update color based on value
  bar.className = 'status-fill';
  if (value >= 70) {
    bar.classList.add('status-high');
  } else if (value >= 30) {
    bar.classList.add('status-medium');
  } else {
    bar.classList.add('status-low');
  }
  
  // Update text
  text.textContent = value;
}

function feed() {
  if (isResting) return; // Can't feed while resting
  hunger = Math.min(100, hunger + 15); // Feeding increases hunger (fills up)
  happiness = Math.min(100, happiness + 5);
  updateStats();
}

// Bowl feeding functionality
function feedFromBowl() {
  if (isResting) return; // Can't feed while resting
  
  const bowl = document.querySelector('#food-bowl img');
  
  // Feed the pet
  hunger = Math.min(100, hunger + 15);
  happiness = Math.min(100, happiness + 5);
  
  // Change bowl to full
  bowl.src = 'images/bowlFull.svg';
  
  updateStats();
  updateBowlState();
}

function updateBowlState() {
  const bowl = document.querySelector('#food-bowl img');
  
  // If hunger is 20 or under, change bowl back to empty
  if (hunger <= 20) {
    bowl.src = 'images/bowlEmpty.svg';
  }
}

function play() {
  if (isResting) return; // Can't play while resting
  happiness = Math.min(100, happiness + 10);
  energy = Math.max(0, energy - 15);
  
  // Create and animate tennis ball
  createTennisBall();
  
  updateStats();
}

function createTennisBall() {
  const gameArea = document.getElementById('game-area');
  
  // Create tennis ball element
  const tennisBall = document.createElement('div');
  tennisBall.className = 'tennis-ball';
  
  // Create img element
  const ballImg = document.createElement('img');
  ballImg.src = 'images/tennisBall.svg';
  ballImg.alt = 'Tennis Ball';
  tennisBall.appendChild(ballImg);
  
  // Add to game area
  gameArea.appendChild(tennisBall);
  
  // Start animation immediately
  requestAnimationFrame(() => {
    tennisBall.classList.add('bounce-animation');
  });
  
  // Remove tennis ball after animation completes
  setTimeout(() => {
    if (tennisBall.parentNode) {
      tennisBall.remove();
    }
  }, 2500);
}

function changeBackground() {
  if (isResting) return; // Can't travel while resting
  
  // Cycle to next background
  currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
  
  const gameArea = document.getElementById('game-area');
  gameArea.style.backgroundImage = `url('${backgroundImages[currentBackgroundIndex]}')`;
  
  // Small happiness boost for traveling to new places
  happiness = Math.min(100, happiness + 3);
  updateStats();
}

function rest() {
  if (isResting) return; // Already resting
  
  isResting = true;
  stopPetMovement(); // Stop movement while resting
  updateButtonStates();
  updateStats();
  
  // Start rest cycle - increase energy every 500ms
  restInterval = setInterval(() => {
    energy = Math.min(100, energy + 10);
    updateStats();
    
    // Stop resting when energy is full
    if (energy >= 100) {
      stopResting();
    }
  }, 500);
}

function stopResting() {
  isResting = false;
  clearInterval(restInterval);
  updateButtonStates();
  updateStats();
  startPetMovement(); // Resume movement when done resting
}

function updateButtonStates() {
  const buttons = document.querySelectorAll('#actions button');
  buttons.forEach(button => {
    if (isResting) {
      button.disabled = true;
      button.style.opacity = '0.5';
    } else {
      button.disabled = false;
      button.style.opacity = '1';
    }
  });
}

function decay() {
  hunger = Math.max(0, hunger - 2); // Hunger decreases over time (pet gets hungry)
  happiness = Math.max(0, happiness - 1);
  energy = Math.max(0, energy - 1);
  updateStats();

  // Check if pet needs care but don't stop the game
  if (hunger <= 0 || happiness <= 0 || energy <= 0) {
    console.log("Your pet needs better care!");
    // Game continues running so player can still interact
  }
}

// Poo mini-game functionality
function createPoo() {
  const poo = document.createElement('div');
  poo.className = 'poo';
  
  // Create img element
  const pooImg = document.createElement('img');
  pooImg.src = 'images/poo.png';
  pooImg.alt = 'Poo';
  poo.appendChild(pooImg);
  
  // Get game area dimensions for constraining poo placement
  const gameArea = document.getElementById('game-area');
  const maxX = gameArea.offsetWidth - 50; // Account for poo size
  const maxY = gameArea.offsetHeight - 50;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  
  poo.style.left = x + 'px';
  poo.style.top = y + 'px';
  
  // Click to remove
  poo.addEventListener('click', function() {
    poo.remove();
    // Small happiness boost for cleaning up
    happiness = Math.min(100, happiness + 2);
    updateStats();
  });
  
  // Append to game area instead of body
  gameArea.appendChild(poo);
}

// Pet movement functionality
function movePetRandomly() {
  if (isResting) return; // Don't move while resting
  
  const pet = document.getElementById('pet');
  const gameArea = document.getElementById('game-area');
  
  // Get game area dimensions
  const gameWidth = gameArea.offsetWidth;
  const gameHeight = gameArea.offsetHeight;
  const petWidth = 150; // Pet image width
  const petHeight = 150; // Approximate pet image height
  
  // Calculate safe movement boundaries
  const maxX = gameWidth - petWidth;
  const maxY = gameHeight - petHeight;
  
  // Generate random position
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  
  // Apply smooth movement
  pet.style.left = newX + 'px';
  pet.style.top = newY + 'px';
}

function startPetMovement() {
  // Move pet every 5-10 seconds randomly
  const moveNextPet = () => {
    movePetRandomly();
    const nextMoveTime = 5000 + Math.random() * 5000; // 5-10 seconds
    movementInterval = setTimeout(moveNextPet, nextMoveTime);
  };
  moveNextPet();
}

function stopPetMovement() {
  if (movementInterval) {
    clearTimeout(movementInterval);
    movementInterval = null;
  }
}

// Background cycling functionality
function changeBackground() {
  if (isResting) return; // Can't travel while resting
  
  // Cycle to next background
  currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
  
  const gameArea = document.getElementById('game-area');
  gameArea.style.backgroundImage = `url('${backgroundImages[currentBackgroundIndex]}')`;
  
  // Small happiness boost for traveling to new places
  happiness = Math.min(100, happiness + 3);
  updateStats();
}

// Start game
updateStats();
const gameLoop = setInterval(decay, 3000);

// Start poo spawning every 30 seconds
const pooLoop = setInterval(createPoo, 30000);

// Start pet movement
startPetMovement();

// Initialize pet name
initializePetName();
