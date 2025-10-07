export function setupFooterAndHeader() {
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  const modified = document.getElementById("lastModified")
  if (modified) modified.textContent = `Last Modification: ${document.lastModified}`;

}
