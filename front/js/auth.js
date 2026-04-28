const API_URL = "https://ferryhenri.alwaysdata.net/stockup/back/api";
//API_URL Docker = "http://localhost:8080/back/api";
//API Local Php = "http://localhost:8000/back/api";
//API AlwaysData = "https://MONCOMPTE.alwaysdata.net/stockup/back/api";


const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("login-message");

    const payload = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
    };

    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message;
        message.className = "message error";
        return;
      }

      message.textContent = data.message;
      message.className = "message success";

      setTimeout(() => {
        window.location.href = "/stockup/front/index.html";
      }, 700);

    } catch (error) {
      message.textContent = "Erreur de connexion au serveur";
      message.className = "message error";
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("register-message");
    
    const password = document.getElementById("password").value;
    
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!isStrongPassword(password)) {
      message.textContent = "Mot de passe trop faible.";
      message.className = "message error";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Les mots de passe ne correspondent pas.";
      message.className = "message error";
      return;
    }

    const payload = {
      nom: document.getElementById("nom").value.trim(),
      prenom: document.getElementById("prenom").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: password
    };

    try {
      const response = await fetch(`${API_URL}/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message;
        message.className = "message error";
        return;
      }

      message.textContent = data.message;
      message.className = "message success";

      setTimeout(() => {
        window.location.href = "/stockup/front/login.html";
      }, 900);

    } catch (error) {
      message.textContent = "Erreur de connexion au serveur";
      message.className = "message error";
    }
  });
}

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordHint = document.getElementById("password-hint");
const confirmPasswordHint = document.getElementById("confirm-password-hint");
const nomInput = document.getElementById("nom");
const prenomInput = document.getElementById("prenom");
const emailInput = document.getElementById("email");

const nomHint = document.getElementById("nom-hint");
const prenomHint = document.getElementById("prenom-hint");
const emailHint = document.getElementById("email-hint");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateBasicHints() {

  // NOM
  if (nomInput && nomHint) {
    if (nomInput.value.trim().length === 0) {
      nomHint.className = "form-hint error";
    } else {
      nomHint.className = "form-hint valid";
    }
  }

  // PRENOM
  if (prenomInput && prenomHint) {
    if (prenomInput.value.trim().length === 0) {
      prenomHint.className = "form-hint error";
    } else {
      prenomHint.className = "form-hint valid";
    }
  }

  // EMAIL
  if (emailInput && emailHint) {
    const value = emailInput.value.trim();

    if (value.length === 0) {
      emailHint.className = "form-hint";
    } else if (isValidEmail(value)) {
      emailHint.className = "form-hint valid";
    } else {
      emailHint.className = "form-hint error";
    }
  }
}

function isStrongPassword(password) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

function updatePasswordHints() {
  if (!passwordInput || !passwordHint) return;

  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput?.value || "";

  if (password.length === 0) {
    passwordHint.className = "form-hint";
  } else if (isStrongPassword(password)) {
    passwordHint.className = "form-hint valid";
  } else {
    passwordHint.className = "form-hint error";
  }

  if (!confirmPasswordInput || !confirmPasswordHint) return;

  if (confirmPassword.length === 0) {
    confirmPasswordHint.className = "form-hint";
    confirmPasswordInput.setCustomValidity("");
  } else if (confirmPassword === password) {
    confirmPasswordHint.className = "form-hint valid";
    confirmPasswordInput.setCustomValidity("");
  } else {
    confirmPasswordHint.className = "form-hint error";
    confirmPasswordInput.setCustomValidity("Les mots de passe ne correspondent pas");
  }
}

// listeners
nomInput?.addEventListener("input", updateBasicHints);
prenomInput?.addEventListener("input", updateBasicHints);
emailInput?.addEventListener("input", updateBasicHints);
passwordInput?.addEventListener("input", updatePasswordHints);
confirmPasswordInput?.addEventListener("input", updatePasswordHints);