import { setupFooterAndHeader } from "./modules.js";
setupFooterAndHeader();


// Password
const password = document.getElementById('password');
const passwordError = document.getElementById('passwordError');
if (password.value.length < 6) {
passwordError.style.display = 'block';
valid = false;
} else {
passwordError.style.display = 'none';
}