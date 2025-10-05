  const problemEl = document.getElementById('problem');
  // const answerInput = document.getElementById('answerInput');
  const feedbackEl = document.getElementById('feedback');
  const mathContainer = document.getElementById('mathContainer');
  const gameHub = document.getElementById('gameHub');
  const iframe = document.getElementById('gameFrame');
  const backBtn = document.getElementById('backBtn');
  const gameList = document.getElementById('gameList');
  const header = gameHub.querySelector('h1');

  let currentSum = 0;

      // mathContainer.style.display = 'none';
      gameHub.style.display = 'flex';
      
  function openGame(url) {
    iframe.src = url;
    iframe.style.display = 'block';
    backBtn.style.display = 'block';
    gameList.style.display = 'none';
    header.style.display = 'none';
    document.body.style.overflow = 'hidden';
    
  }

  function closeGame() {
    iframe.src = '';
    iframe.style.display = 'none';
    backBtn.style.display = 'none';
    gameList.style.display = 'block';
    header.style.display = 'block';
    document.body.style.overflow = 'auto';
  }