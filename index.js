const iframe = document.getElementById('gameFrame');
const backBtn = document.getElementById('backBtn');
const url = "https://script.google.com/macros/s/AKfycbz9iZOxW_LUhyWiWalrqMnVYC0UGj9PEqaYl_BLeHON7GPmMhDa4e_aL-Kbsv6fO9iPXw/exec"
let activityTimer = null; 


function switchTab(tab) {
  const tabContents = document.getElementsByClassName("page-content");

  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display="none";
  }

  document.getElementById("page-" + tab).style.display = "block"


}
function openGame(url, gameTitle) {
  console.log("opening game at " + url)
  iframe.src = url;
  iframe.style.display = 'block';
  backBtn.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  trackGamePlay(gameTitle);
  startTimer();

}

function closeGame() {
  iframe.src = '';
  iframe.style.display = 'none';
  backBtn.style.display = 'none';
  document.body.style.overflow = 'auto';

  if (activityTimer) {
        clearInterval(activityTimer); 
        activityTimer = null;  
        console.log("Timer Stopped.");
    }
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
    gameDiv.onclick = () => openGame(ggg.path, ggg.title);

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
    gameDiv.onclick = () => openGame(ggg.path, ggg.title);

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

function startTimer() {
    const savedUser = localStorage.getItem('userSchoolInfo');
    if (!savedUser) return;

    const schoolData = JSON.parse(savedUser);

    activityTimer = setInterval(() => {
        if (document.hidden) {
            console.log("Tab hidden. Timer paused.");
            return;
        }
        
        console.log("Sending 60s of support to " + schoolData.school);
        fetch(`${url}?action=logTime&school=${encodeURIComponent(schoolData.school)}&city=${encodeURIComponent(schoolData.city)}&state=${encodeURIComponent(schoolData.state)}&seconds=60`, {
            method: 'GET',
            mode: 'no-cors' 
        })
        .then(() => {
            console.log("60s contributed!");
        });
        
    }, 60000);
} 

