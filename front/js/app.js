const API = "http://localhost:8000/back/api";

document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  loadProducts();
  loadShoppingList();
});

async function loadUser() {
  try {
    const res = await fetch(`${API}/account.php`, {
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      window.location.href = "login.html";
      return;
    }

    document.getElementById("user-prenom").textContent = data.user.prenom;
    document.getElementById("user-fullname").textContent =
      `${data.user.prenom} ${data.user.nom}`;

  } catch (error) {
    window.location.href = "login.html";
  }
}

async function loadProducts() {
  const res = await fetch(`${API}/get_products.php`, {
    credentials: "include"
  });

  const data = await res.json();
  const container = document.getElementById("product-list");

  container.innerHTML = "";

  data.products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product-card";

    const low = Number(p.quantite_stock) <= Number(p.seuil_minimum);

    div.innerHTML = `
      <div class="product-main">
        <strong>${escapeHtml(p.nom)}</strong>
        <span class="product-category">${escapeHtml(p.categorie)}</span>
        <div class="product-meta">
          Quantité : ${p.quantite_stock} | Seuil min. : ${p.seuil_minimum}
        </div>
      </div>

      <span class="badge ${low ? "badge-low" : "badge-ok"}">
        ${low ? "Stock bas" : "OK"}
      </span>

      <div class="actions">
        <button class="btn btn-small btn-primary">Modifier</button>
        <button class="btn btn-small btn-danger">Supprimer</button>
      </div>
    `;

    container.appendChild(div);
  });
}

async function loadShoppingList() {
  const res = await fetch(`${API}/get_list.php`, {
    credentials: "include"
  });

  const data = await res.json();
  const container = document.getElementById("shopping-list");

  container.innerHTML = "";

  data.shopping_list.forEach((item) => {
    const div = document.createElement("div");
    div.className = "shopping-item";

    div.innerHTML = `
      <span class="checkbox-fake"></span>
      <strong>${escapeHtml(item.nom)}</strong>
      <span>x ${item.quantite_souhaitee}</span>
      <button class="buy-btn" onclick="buy(${item.id_ligne})">🛒</button>
    `;

    container.appendChild(div);
  });
}

document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch(`${API}/add_product.php`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nom: document.getElementById("nom").value,
      categorie: document.getElementById("categorie").value,
      quantite_stock: document.getElementById("quantite").value,
      seuil_minimum: document.getElementById("seuil").value
    })
  });

  e.target.reset();
  loadProducts();
});

document.getElementById("generate-btn").addEventListener("click", async () => {
  await fetch(`${API}/generate_list.php`, {
    method: "POST",
    credentials: "include"
  });

  loadShoppingList();
});

async function buy(id) {
  await fetch(`${API}/buy_product.php`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_ligne: id })
  });

  loadProducts();
  loadShoppingList();
}

document.getElementById("logout-btn").addEventListener("click", async () => {
  await fetch(`${API}/logout.php`, {
    credentials: "include"
  });

  window.location.href = "login.html";
});

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}