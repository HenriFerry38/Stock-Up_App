const API_URL = "http://localhost:8000/back/api";

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
        window.location.href = "index.html";
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

    const payload = {
      nom: document.getElementById("nom").value.trim(),
      prenom: document.getElementById("prenom").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
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
        window.location.href = "login.html";
      }, 900);

    } catch (error) {
      message.textContent = "Erreur de connexion au serveur";
      message.className = "message error";
    }
  });
}