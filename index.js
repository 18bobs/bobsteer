const iframe = document.getElementById('gameFrame');
const backBtn = document.getElementById('backBtn');
    
function openGame(url) {
  iframe.src = url;
  iframe.style.display = 'block';
  backBtn.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
}

function closeGame() {
  iframe.src = '';
  iframe.style.display = 'none';
  backBtn.style.display = 'none';
  document.body.style.overflow = 'auto';
}


const gameContainer = document.getElementById("container"); 

function removeAllChildren(parentElement) {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
}

removeAllChildren(gameContainer);

gameData.forEach(game => {
  const gameDiv = document.createElement("div");
  gameDiv.className = "game-icon";
  gameDiv.onclick = () => openGame(game.path);

  const img = document.createElement("img");
  img.src = game.cover;
  img.alt = `${game.title} Cover`;

  const titleDiv = document.createElement("div");
  titleDiv.className = "game-name";
  titleDiv.textContent = game.title;

  gameDiv.appendChild(img);
  gameDiv.appendChild(titleDiv);

  gameContainer.appendChild(gameDiv);
});