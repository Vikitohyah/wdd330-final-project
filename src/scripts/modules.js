export function setupFooterAndHeader() {
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  const modified = document.getElementById("lastModified")
  if (modified) modified.textContent = `Last Modification: ${document.lastModified}`;

  // Navigation toggle (My hamburger menu)
  const navigation = document.querySelector('nav');
  const hamburger = document.querySelector('#menu');

  if (hamburger && navigation) {
    hamburger.addEventListener('click', () => {
      navigation.classList.toggle('show');
      hamburger.classList.toggle('show');
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {

    const savedTheme = localStorage.getItem('theme');
    const isLightMode = savedTheme === 'light';
    document.body.classList.toggle('light-mode', isLightMode);
    themeToggle.checked = isLightMode;
    
    themeToggle.addEventListener('change', () => {
      document.body.classList.toggle('light-mode', themeToggle.checked);
      localStorage.setItem('theme', themeToggle.checked ? 'light' : 'dark');
    });
  }

}
