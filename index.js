const iframe = document.getElementById('gameFrame');
const backBtn = document.getElementById('backBtn');

function openGame(url, gameTitle, categoryName) {
  console.log("opening game at " + url)
  iframe.src = url;
  iframe.style.display = 'block';
  backBtn.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  trackGamePlay(gameTitle, categoryName);

}

function closeGame() {
  iframe.src = '';
  iframe.style.display = 'none';
  backBtn.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function loadCategory(name) {
  removeAllChildren(gameContainer);

  // update state of category buttons
  var categoryButtonsContainer = document.getElementById("category-buttons");
  
  for (const child of categoryButtonsContainer.children) {
    child.classList.remove("bg-white");
    child.classList.remove("bg-orange");
    if (child.id == "btn-" + name) {
      child.classList.add("bg-orange");
    } else {
      child.classList.add("bg-white");
    }
  }
  

  // create the divs for individual games
  for (const game of gameData) {

    if (name != 'All') {
      var tagFound = false;

      for (tag of game.tags) {
        if (tag == name) {
          tagFound = true;
        }
      }

      if (!tagFound) {
        continue;
      }
    }

    const ggg = game

    const gameDiv = document.createElement("div");
    gameDiv.className = "game-icon";
    gameDiv.onclick = () => openGame(ggg.path, ggg.title, name);

    const img = document.createElement("img");
    img.src = game.cover;
    img.alt = `${game.title} Cover`;

    const titleDiv = document.createElement("div");
    titleDiv.className = "game-name";
    titleDiv.textContent = game.title;

    gameDiv.appendChild(img);
    gameDiv.appendChild(titleDiv);

    gameContainer.appendChild(gameDiv);
  }

}


const gameContainer = document.getElementById("container"); 
const searchBar = document.getElementById("searchBar");

function removeAllChildren(parentElement) {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
}

searchBar.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();

  if (query === "") {
    loadCategory("All");
    return;
  }

  removeAllChildren(gameContainer);

  for (const game of gameData) {
    if (!game.title.toLowerCase().startsWith(query)) continue;

    const ggg = game

    const gameDiv = document.createElement("div");
    gameDiv.className = "game-icon";
    gameDiv.onclick = () => openGame(ggg.path, ggg.title, name);

    const img = document.createElement("img");
    img.src = game.cover;
    img.alt = `${game.title} Cover`;

    const titleDiv = document.createElement("div");
    titleDiv.className = "game-name";
    titleDiv.textContent = game.title;

    gameDiv.appendChild(img);
    gameDiv.appendChild(titleDiv);
    gameContainer.appendChild(gameDiv);
  }
});



loadCategory("Recommended")