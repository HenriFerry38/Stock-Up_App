const API = "http://localhost:8000/back/api";

document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  loadProducts();
  loadShoppingList();
  initNavigation();
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

  const dashboardContainer = document.getElementById("product-list");
  const fullContainer = document.getElementById("full-product-list");

  if (dashboardContainer) dashboardContainer.innerHTML = "";
  if (fullContainer) fullContainer.innerHTML = "";

  data.products.forEach((product) => {
    if (dashboardContainer) {
      dashboardContainer.appendChild(renderProductCard(product));
    }

    if (fullContainer) {
      fullContainer.appendChild(renderProductCard(product));
    }
  });
}

async function loadShoppingList() {
  const res = await fetch(`${API}/get_list.php`, {
    credentials: "include"
  });

  const data = await res.json();

  const dashboardContainer = document.getElementById("shopping-list");
  const fullContainer = document.getElementById("full-shopping-list");

  if (dashboardContainer) dashboardContainer.innerHTML = "";
  if (fullContainer) fullContainer.innerHTML = "";

  data.shopping_list.forEach((item) => {
    if (dashboardContainer) {
      dashboardContainer.appendChild(renderShoppingItem(item));
    }

    if (fullContainer) {
      fullContainer.appendChild(renderShoppingItem(item));
    }
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

async function generateShoppingList() {
  await fetch(`${API}/generate_list.php`, {
    method: "POST",
    credentials: "include"
  });
}

document.getElementById("generate-btn").addEventListener("click", async () => {
  await generateShoppingList();
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

function initNavigation() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showView(link.dataset.view);
    });
  });
  
  document.getElementById("logo-home")?.addEventListener("click", () => {
    showView("dashboard");
  });

  document.getElementById("view-stock-btn")?.addEventListener("click", () => {
    showView("stock");
  });

  document.getElementById("generate-full-btn")?.addEventListener("click", async () => {
    await generateShoppingList();
    loadShoppingList();
  });

  document.getElementById("view-shopping-btn")?.addEventListener("click", () => {
    showView("shopping");
  });
}

function showView(viewName) {
  document.querySelectorAll("[data-section]").forEach((section) => {
    section.classList.add("hidden");
  });

  document.querySelector(`[data-section="${viewName}"]`)?.classList.remove("hidden");

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === viewName);
  });

  if (viewName === "stock") {
    loadProducts();
  }

  if (viewName === "shopping") {
    loadShoppingList();
  }
}

function renderProductCard(p) {
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

  return div;
}

function renderShoppingItem(item) {
  const div = document.createElement("div");
  div.className = "shopping-item";

  div.innerHTML = `
    <span class="checkbox-fake"></span>
    <strong>${escapeHtml(item.nom)}</strong>
    <span>x ${item.quantite_souhaitee}</span>
    <button class="buy-btn" onclick="buy(${item.id_ligne})">🛒</button>
  `;

  return div;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}