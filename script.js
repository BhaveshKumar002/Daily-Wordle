let wordOfTheDay;
let currentRow = 0;
let currentTile = 0;
let gameOver = false;

const board = document.getElementById("board");
const message = document.getElementById("message");

// Create the board
for (let i = 0; i < 6; i++) {
  let row = document.createElement("div");
  row.classList.add("row");
  for (let j = 0; j < 5; j++) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    row.appendChild(tile);
  }
  board.appendChild(row);
}

// Fetch word of the day
async function getWordOfTheDay() {
  let response = await fetch("words.json");
  let data = await response.json();
  let today = new Date();
  let startDate = new Date("2025-01-01");
  let dayNumber = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  let wordIndex = dayNumber % data.words.length;
  return data.words[wordIndex].toLowerCase();
}

getWordOfTheDay().then(word => {
  wordOfTheDay = word;
  console.log("Today's Word:", wordOfTheDay); // Debug
});

// Handle physical keyboard
document.addEventListener("keydown", e => {
  handleInput(e.key);
});

// Handle on-screen keyboard clicks
document.querySelectorAll("#keyboard button").forEach(button => {
  button.addEventListener("click", () => {
    let key = button.textContent;

    if (button.id === "enter") key = "Enter";
    if (button.id === "backspace") key = "Backspace";

    handleInput(key);
  });
});

// Core input handler
function handleInput(key) {
  if (gameOver || !wordOfTheDay) return;

  if (/^[a-zA-Z]$/.test(key) && currentTile < 5) {
    let row = board.children[currentRow];
    let tile = row.children[currentTile];
    tile.textContent = key.toUpperCase();
    currentTile++;
  }
  else if (key === "Backspace" && currentTile > 0) {
    currentTile--;
    let row = board.children[currentRow];
    row.children[currentTile].textContent = "";
  }
  else if (key === "Enter" && currentTile === 5) {
    checkWord();
  }
}

function checkWord() {
  let row = board.children[currentRow];
  let guess = "";
  for (let i = 0; i < 5; i++) {
    guess += row.children[i].textContent.toLowerCase();
  }

  if (guess.length !== 5) return;

  // Coloring tiles
  for (let i = 0; i < 5; i++) {
    if (guess[i] === wordOfTheDay[i]) {
      row.children[i].classList.add("correct");
    } else if (wordOfTheDay.includes(guess[i])) {
      row.children[i].classList.add("present");
    } else {
      row.children[i].classList.add("absent");
    }
  }

  if (guess === wordOfTheDay) {
    message.textContent = "🎉 You guessed it!";
    gameOver = true;
    return;
  }

  currentRow++;
  currentTile = 0;

  if (currentRow === 6) {
    message.textContent = `❌ Out of tries! The word was: ${wordOfTheDay.toUpperCase()}`;
    gameOver = true;
  }
}
