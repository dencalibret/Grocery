/************************************
 * 1. Дані (категорії та товари) – приклад
 ************************************/
let categoriesData = [
  { id: 1, name: "М'ясні продукти" },
  { id: 2, name: "Молочні продукти" },
  { id: 3, name: "Овочі та фрукти" },
  { id: 4, name: "Снеки та солодощі" },
  { id: 5, name: "Напої" },
  { id: 6, name: "Випічка" },
];

let productsData = [];  // Це масив для зберігання продуктів

// Логін та пароль для доступу до адмін-панелі
const correctUsername = 'dencalibre';
const correctPassword = '12345den';

/************************************
 * 2. Збереження/завантаження у localStorage
 ************************************/
// Завантаження даних категорій та товарів із localStorage
function loadDataFromStorage() {
  const cats = localStorage.getItem("myCategories");
  const prods = localStorage.getItem("myProducts");
  if (cats) categoriesData = JSON.parse(cats);
  if (prods) productsData = JSON.parse(prods);
}

// Збереження категорій в localStorage
function saveCategories() {
  localStorage.setItem("myCategories", JSON.stringify(categoriesData));
}

// Збереження товарів в localStorage
function saveProducts() {
  localStorage.setItem("myProducts", JSON.stringify(productsData));
}

/************************************
 * 3. Кошик через localStorage
 ************************************/
// Отримання даних кошика з localStorage
function getCart() {
  const cartStr = localStorage.getItem("myCart");
  return cartStr ? JSON.parse(cartStr) : [];
}

// Збереження даних кошика в localStorage
function setCart(cartArr) {
  localStorage.setItem("myCart", JSON.stringify(cartArr));
}

// Додавання товару в кошик
function addToCart(prodId) {
  const cart = getCart();
  cart.push(prodId);
  setCart(cart);
  updateCartCount();
}

// Видалення товару з кошика за індексом
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
  updateCartCount();
}

// Очистити кошик
function clearCart() {
  setCart([]);
  updateCartCount();
}

// Оновлення кількості товарів в кошику
function updateCartCount() {
  const cartCountEl = document.getElementById("cartCount");
  if (!cartCountEl) return;
  cartCountEl.textContent = getCart().length;
}

/************************************
 * 4. DOMContentLoaded – ініціалізація
 ************************************/
// Виконується при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  loadDataFromStorage();  // Завантажуємо дані з localStorage
  updateCartCount();      // Оновлюємо кількість товарів в кошику

  const path = window.location.pathname;
  if (path.includes("index.html")) {
    renderIndexPage();  // Якщо це головна сторінка
  } else if (path.includes("categories.html")) {
    renderCategoriesPage();  // Якщо це сторінка категорій
  } else if (path.includes("product.html")) {
    renderProductPage();  // Якщо це сторінка товару
  } else if (path.includes("cart.html")) {
    renderCartPage();  // Якщо це сторінка кошика
  } else if (path.includes("admin.html")) {
    renderAdminPage();  // Якщо це сторінка адмін-панелі
  } else if (path.includes("login.html")) {
    loginPage(); // Перевіряємо чи є сторінка для логіну
  }
});

/************************************
 * 5. Функції рендерингу
 ************************************/

/* ========== Головна ========== */
// Відображення товарів на головній сторінці
function renderIndexPage() {
  const container = document.querySelector(".products-container");
  if (!container) return;

  // Якщо користувач перейшов із категорій
  const selectedCatId = localStorage.getItem("selectedCategory");
  let filtered = productsData;
  if (selectedCatId) {
    filtered = productsData.filter(p => p.categoryId === +selectedCatId);
    localStorage.removeItem("selectedCategory");
  }

  let html = "";
  filtered.forEach(prod => {
    html += `
      <article class="product-card">
        <img src="${prod.image}" alt="${prod.name}">
        <h3>${prod.name}</h3>
        <p>Ціна: ${prod.price} грн</p>
        <button class="add-to-cart-btn" data-id="${prod.id}">В кошик</button>
      </article>
    `;
  });
  container.innerHTML = html;

  // Обробка кліку на кнопку «В кошик»
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const id = +e.target.getAttribute("data-id");
      addToCart(id);  // Додаємо товар до кошика
    }
  });
}

/* ========== Категорії ========== */
// Відображення всіх категорій на сторінці категорій
function renderCategoriesPage() {
  const catContainer = document.querySelector(".categories-container");
  if (!catContainer) return;

  let html = "";
  categoriesData.forEach(cat => {
    html += `<article class="category-card" data-id="${cat.id}">${cat.name}</article>`;
  });
  catContainer.innerHTML = html;

  // Обробка кліку на категорію
  catContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-card")) {
      const id = e.target.getAttribute("data-id");
      localStorage.setItem("selectedCategory", id);  // Зберігаємо вибрану категорію
      window.location.href = "index.html";  // Переходимо на головну сторінку
    }
  });
}

/* ========== Товар (демо – показуємо перший) ========== */
// Відображення товару на сторінці товару
function renderProductPage() {
  const prod = productsData[0];  // У реальній задачі беремо id з URL
  if (!prod) return;

  const titleEl = document.querySelector("h2");
  const infoEl = document.querySelector(".product-info");
  const imgEl = document.querySelector(".product-details img");

  if (titleEl) titleEl.textContent = prod.name;
  if (imgEl) imgEl.src = prod.image;
  if (infoEl) {
    infoEl.innerHTML = `
      <p>Ціна: ${prod.price} грн</p>
      <button class="add-to-cart-btn" data-id="${prod.id}">В кошик</button>
    `;
    infoEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart-btn")) {
        addToCart(prod.id);  // Додаємо товар до кошика
      }
    });
  }
}

/* ========== Кошик ========== */
// Відображення вмісту кошика
function renderCartPage() {
  const itemsEl = document.querySelector(".cart-items");
  const totalEl = document.querySelector(".cart-total strong");
  const checkoutBtn = document.querySelector(".cart-total button");
  if (!itemsEl || !totalEl || !checkoutBtn) return;

  const cart = getCart();
  if (!cart.length) {
    itemsEl.innerHTML = "<p>Кошик порожній</p>";
    totalEl.textContent = "0 грн";
  } else {
    let sum = 0;
    let html = "";
    cart.forEach((id, index) => {
      const prod = productsData.find(p => p.id === id);
      if (prod) {
        sum += prod.price;
        html += `
          <div class="cart-item">
            <span>${prod.name} – ${prod.price} грн</span>
            <button data-idx="${index}" class="remove-btn">Видалити</button>
          </div>
        `;
      }
    });
    itemsEl.innerHTML = html;
    totalEl.textContent = sum + " грн";

    // Видалення товару
    itemsEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const idx = +e.target.getAttribute("data-idx");
        removeFromCart(idx);  // Видаляємо товар з кошика
        renderCartPage();
      }
    });
  }

  // Обробка оформлення замовлення
  checkoutBtn.addEventListener("click", () => {
    if (!getCart().length) {
      alert("Кошик порожній, немає чого оформляти!");
      return;
    }
    clearCart();  // Очищаємо кошик
    renderCartPage();
    alert("Замовлення оформлено!");
  });
}

/* ========== Адмін-панель ========== */
// Відображення товарів в адмін-панелі
function renderAdminPage() {
  const productForm = document.querySelector(".product-form");
  const productListEl = document.querySelector(".admin-product-list");
  const categorySelect = document.querySelector(".category-select");

  if (!productForm || !productListEl || !categorySelect) return;

  // Заповнюємо список категорій в селекті
  let catOpts = '<option disabled selected>Оберіть категорію</option>';
  categoriesData.forEach(c => {
    catOpts += `<option value="${c.id}">${c.name}</option>`;
  });
  categorySelect.innerHTML = catOpts;

  updateAdminList(productListEl);  // Оновлюємо список товарів

  // Додавання товару
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = productForm.querySelector(".name-input");
    const priceInput = productForm.querySelector(".price-input");
    const imgInput = productForm.querySelector(".img-input");
    const catValue = categorySelect.value;

    if (!nameInput || !priceInput || !imgInput || !catValue) return;
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const catId = parseInt(catValue);
    const imageUrl = imgInput.value.trim();

    if (!name || isNaN(price) || isNaN(catId) || !imageUrl) {
      alert("Некоректні дані!");
      return;
    }

    const newId = Date.now();
    productsData.push({
      id: newId,
      name,
      price,
      categoryId: catId,
      image: imageUrl,
    });
    saveProducts();  // Зберігаємо новий список товарів
    updateAdminList(productListEl);  // Оновлюємо список товарів
    productForm.reset();  // Очищаємо форму
  });
}

// Оновлення списку товарів в адмін-панелі
function updateAdminList(wrapper) {
  let html = "<ul>";
  productsData.forEach(p => {
    const cat = categoriesData.find(c => c.id === p.categoryId);
    const catName = cat ? cat.name : "Без категорії";
    html += `
      <li>
        ${p.name} – ${p.price} грн ( ${catName} )
        <button data-id="${p.id}" class="delete-prod-btn">Видалити</button>
      </li>
    `;
  });
  html += "</ul>";
  wrapper.innerHTML = html;

  // Видалення товару
  wrapper.querySelectorAll(".delete-prod-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const prodId = +btn.getAttribute("data-id");
      const idx = productsData.findIndex(item => item.id === prodId);
      if (idx !== -1) {
        productsData.splice(idx, 1);  // Видаляємо товар
        saveProducts();  // Зберігаємо оновлений список товарів
        updateAdminList(wrapper);  // Оновлюємо список товарів
      }
    });
  });
}

// Функція для обробки логіну (додаємо тут перевірку)
function loginPage() {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === correctUsername && password === correctPassword) {
      window.location.href = "admin.html";  // Перехід на адмін-панель
    } else {
      alert("Невірний логін або пароль!");
    }
  });
}
