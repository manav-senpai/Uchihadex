// Function to switch between modules and themes
function loadContent(content) {
  const modulesSection = document.getElementById('modules-section');
  const themesSection = document.getElementById('themes-section');

  if (content === 'themes') {
    modulesSection.style.display = 'none';
    themesSection.style.display = 'block';
  } else {
    modulesSection.style.display = 'block';
    themesSection.style.display = 'none';
  }
}

// Theme switching functionality - triggered by Apply button
document.addEventListener('DOMContentLoaded', () => {
  const applyButtons = document.querySelectorAll('.apply-btn');
  const themeLink = document.getElementById('theme-link');

  applyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const theme = button.getAttribute('data-theme');
      if (themeLink) {
        themeLink.setAttribute('href', `css/${theme}.css`);
        localStorage.setItem('selectedTheme', theme); // Save selected theme
      }
    });
  });

  // On page load, apply the saved theme from localStorage (if any)
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme && themeLink) {
    themeLink.setAttribute('href', `css/${savedTheme}.css`);
  }
});
