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


  // function generateProblem() {
  //   const a = Math.floor(Math.random() * 99) + 1;
  //   const b = Math.floor(Math.random() * 99) + 1;
  //   currentSum = a + b;
  //   problemEl.textContent = `${a} + ${b} = ?`;
  //   feedbackEl.textContent = '';
  //   answerInput.value = '';
  //   answerInput.focus();
  // }

  // generateProblem();

  // answerInput.addEventListener('input', () => {
  //   const val = answerInput.value.trim();

  //   if (val === 'bre') {
  //     mathContainer.style.display = 'none';
  //     gameHub.style.display = 'flex';
  //     answerInput.value = '';
  //     return;
  //   }

  //   if (/^\d+$/.test(val)) {
  //     if (parseInt(val, 10) === currentSum) {
  //       feedbackEl.textContent = 'Correct!';
  //       generateProblem(); // immediately generate next without delay
  //     } else {
  //       feedbackEl.textContent = '';
  //     }
  //   } else {
  //     feedbackEl.textContent = '';
  //   }
  // });

  function openGame(url) {
    // <iframe is="x-frame-bypass" src="https://example.org/"></iframe>
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