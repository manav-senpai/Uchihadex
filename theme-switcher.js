// Get all theme cards (buttons)
const themeCards = document.querySelectorAll('.theme-card');

// Add event listener to each theme card
themeCards.forEach(card => {
  card.addEventListener('click', () => {
    const themeName = card.getAttribute('data-theme'); // Get the theme name
    switchTheme(themeName); // Call the switchTheme function
  });
});

// Function to switch themes
function switchTheme(themeName) {
  let themeLink = document.getElementById('theme-style'); // Get the theme link tag

  // If the theme link tag doesn't exist, create it
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.id = 'theme-style';
    document.head.appendChild(themeLink);
  }

  // Set the href attribute of the theme link tag to point to the selected theme's CSS file
  themeLink.href = `themes/${themeName}.css`; // Update with the correct path to your theme files
}
