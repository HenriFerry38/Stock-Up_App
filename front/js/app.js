const API = "https://ferryhenri.alwaysdata.net/stockup/back/api";
//API_URL Docker = "http://localhost:8080/back/api";
//API Local Php = "http://localhost:8000/back/api";
//API AlwaysData = "https://MONCOMPTE.alwaysdata.net/stockup/back/api";

let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("category-filter")?.addEventListener("change", applyProductFilters);
  document.getElementById("search-product")?.addEventListener("input", applyProductFilters);
  document.getElementById("full-search-product")?.addEventListener("input", applyFullProductFilters);
  document.getElementById("full-category-filter")?.addEventListener("change", applyFullProductFilters);

  loadUser();
  loadProducts();
  loadShoppingList();
  initNavigation();
  initModals();
});

async function loadUser() {
  try {

    const res = await fetch(`${API}/account.php`, {
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {

      window.location.href = "/stockup/front/login.html";
      return;
    }

    document.getElementById("user-prenom").textContent = data.user.prenom;
    document.getElementById("user-fullname").textContent =
      `${data.user.prenom} ${data.user.nom}`;

  } catch (error) {
    window.location.href = "/stockup/front/login.html";
  }
}

async function loadProducts() {
  const res = await fetch(`${API}/get_products.php`, {
    credentials: "include"
  });

  const data = await res.json();

  allProducts = data.products;
  fillCategoryFilter(allProducts);

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

  window.location.href = "/stockup/front/login.html";
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
      <button class="btn btn-small btn-primary"
        onclick='openEditProduct(${JSON.stringify(p)})'>
        Modifier
      </button>

      <button class="btn btn-small btn-danger"
        onclick="deleteProduct(${p.id_produit})">
        Supprimer
      </button>
    </div>
  `;

  return div;
}

function initModals() {

  // fermer modal édition
  document.getElementById("cancel-edit-btn")?.addEventListener("click", () => {
    document.getElementById("edit-modal").classList.add("hidden");
  });

  // fermer modal suppression
  document.getElementById("cancel-delete-btn")?.addEventListener("click", () => {
    document.getElementById("delete-modal").classList.add("hidden");
  });

  // clic dehors (edit)
  document.getElementById("edit-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "edit-modal") {
      document.getElementById("edit-modal").classList.add("hidden");
    }
  });

  // clic dehors (delete)
  document.getElementById("delete-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "delete-modal") {
      document.getElementById("delete-modal").classList.add("hidden");
    }
  });

  document.getElementById("edit-product-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

  await updateProduct({
    id_produit: document.getElementById("edit-id").value,
    nom: document.getElementById("edit-nom").value.trim(),
    categorie: document.getElementById("edit-categorie").value.trim(),
    quantite_stock: document.getElementById("edit-quantite").value,
    seuil_minimum: document.getElementById("edit-seuil").value
  });

    document.getElementById("edit-modal").classList.add("hidden");
  });

  document.getElementById("confirm-delete-btn")?.addEventListener("click", async () => {
    const idProduit = document.getElementById("delete-id").value;

    const res = await fetch(`${API}/delete_product.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_produit: idProduit
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Erreur lors de la suppression");
      return;
    }

    document.getElementById("delete-modal").classList.add("hidden");

    await loadProducts();
    await loadShoppingList();
  });
}

function openEditProduct(product) {
  fillCategoryFilter(allProducts);

  document.getElementById("edit-id").value = product.id_produit;
  document.getElementById("edit-nom").value = product.nom;
  document.getElementById("edit-categorie").value = product.categorie;
  document.getElementById("edit-quantite").value = product.quantite_stock;
  document.getElementById("edit-seuil").value = product.seuil_minimum;

  document.getElementById("edit-modal").classList.remove("hidden");
}

function deleteProduct(idProduit) {
  document.getElementById("delete-id").value = idProduit;
  document.getElementById("delete-modal").classList.remove("hidden");
}

async function updateProduct(product) {
  const res = await fetch(`${API}/update_product.php`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Erreur lors de la modification");
    return;
  }

  await loadProducts();
  await loadShoppingList();
}

async function deleteProduct(idProduit) {
  document.getElementById("delete-id").value = idProduit;
  document.getElementById("delete-modal").classList.remove("hidden");
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

function fillCategoryFilter(products) {

  const filterSelect = document.getElementById("category-filter");

  const fullFilterSelect = document.getElementById("full-category-filter");

  const datalist = document.getElementById("categories-list");

  const categories = [...new Set(
    products
      .map((product) => product.categorie)
      .filter(Boolean)
  )].sort();

  // filtre categorie

  if (filterSelect) {
    const currentValue = filterSelect.value;

    filterSelect.innerHTML = `<option value="">Toutes les catégories</option>`;

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      filterSelect.appendChild(option);
    });

    filterSelect.value = currentValue;
  }

  // select Full
  if (fullFilterSelect) {
    const currentValue = fullFilterSelect.value;

    fullFilterSelect.innerHTML = `<option value="">Toutes les catégories</option>`;

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        fullFilterSelect.appendChild(option);
    });

    fullFilterSelect.value = currentValue;
  }

  if (datalist) {
    datalist.innerHTML = "";

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      datalist.appendChild(option);
    });
  }
}


function applyProductFilters() {
  const searchValue = document.getElementById("search-product")?.value.toLowerCase().trim() || "";
  const categoryValue = document.getElementById("category-filter")?.value || "";

  const filteredProducts = allProducts.filter((product) => {
    const matchSearch = product.nom.toLowerCase().includes(searchValue);
    const matchCategory = !categoryValue || product.categorie === categoryValue;

    return matchSearch && matchCategory;
  });

  const dashboardContainer = document.getElementById("product-list");
  if (!dashboardContainer) return;

  dashboardContainer.innerHTML = "";

  filteredProducts.forEach((product) => {
    dashboardContainer.appendChild(renderProductCard(product));
  });
}

function applyFullProductFilters() {
  const searchValue = document.getElementById("full-search-product")?.value.toLowerCase().trim() || "";
  const categoryValue = document.getElementById("full-category-filter")?.value || "";

  const filteredProducts = allProducts.filter((product) => {
    const matchSearch = product.nom.toLowerCase().includes(searchValue);
    const matchCategory = !categoryValue || product.categorie === categoryValue;

    return matchSearch && matchCategory;
  });

  const fullContainer = document.getElementById("full-product-list");
  if (!fullContainer) return;

  fullContainer.innerHTML = "";

  filteredProducts.forEach((product) => {
    fullContainer.appendChild(renderProductCard(product));
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}