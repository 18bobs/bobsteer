function trackGamePlay(gameTitle) {
  gtag('event', 'Game', {
    game_name: gameTitle,
  });
}
