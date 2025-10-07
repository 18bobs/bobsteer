function trackGamePlay(gameTitle, gameCategory) {
  gtag('event', 'Game', {
    game_name: gameTitle,
    category: gameCategory
  });
}
