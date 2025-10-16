import { setupFooterAndHeader } from "./modules.js";
setupFooterAndHeader();

document.addEventListener("DOMContentLoaded", () => {
    const now = new Date().toISOString();
    document.getElementById("timestamp").value = now;
});

const joinForm = document.getElementById('joinForm');

joinForm.addEventListener('submit', () => {
    let valid = true;

    // Name
    const name = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (!name.value.trim()) {
    nameError.style.display = 'block';
    valid = false;
    } else {
    nameError.style.display = 'none';
    }

    // Email
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    if (!email.validity.valid) {
    emailError.style.display = 'block';
    valid = false;
    } else {
    emailError.style.display = 'none';
    }

    // Password
    const password = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    if (password.value.length < 6) {
    passwordError.style.display = 'block';
    valid = false;
    } else {
    passwordError.style.display = 'none';
    }

    // Confirm Password
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmError = document.getElementById('confirmError');
    if (password.value !== confirmPassword.value) {
    confirmError.style.display = 'block';
    valid = false;
    } else {
    confirmError.style.display = 'none';
    }

    // Plan
    const plan = document.getElementById('plan');
    const planError = document.getElementById('planError');
    if (!plan.value) {
    planError.style.display = 'block';
    valid = false;
    } else {
    planError.style.display = 'none';
    }

    // If valid, go to thank you page
    if (valid) {
    window.location.href = "thankyou.html";
    }
});