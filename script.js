const services = [
  {
    name: "Banho e Tosa Premium",
    description: "Higiene completa com produtos hipoalergenicos.",
    image:
      "https://loremflickr.com/1200/800/dog-grooming?lock=15"
  },
  {
    name: "Consulta Veterinaria",
    description: "Acompanhamento preventivo e vacinacao.",
    image:
      "https://loremflickr.com/1200/800/veterinarian,pet?lock=17"
  },
  {
    name: "Hotelzinho Pet",
    description: "Conforto, lazer e monitoramento diario.",
    image:
      "https://loremflickr.com/1200/800/pet-hotel?lock=16"
  }
];

const products = [
  {
    id: 1,
    category: "caes",
    name: "Racao Super Premium Caes",
    description: "Pacote 10kg para adultos de porte medio.",
    price: 199.9,
    image:
      "https://loremflickr.com/1200/800/dog-food?lock=21"
  },
  {
    id: 2,
    category: "caes",
    name: "Brinquedo Mordedor",
    description: "Borracha resistente para estimular o pet.",
    price: 39.9,
    image:
      "https://loremflickr.com/1200/800/dog-toy?lock=22"
  },
  {
    id: 3,
    category: "gatos",
    name: "Areia Higienica 12kg",
    description: "Controle de odor e alta absorcao.",
    price: 72.5,
    image:
      "https://loremflickr.com/1200/800/cat?lock=23"
  },
  {
    id: 4,
    category: "gatos",
    name: "Racao para Gatos Castrados",
    description: "Sabor salmao, pacote 7,5kg.",
    price: 189.0,
    image:
      "https://loremflickr.com/1200/800/cat-food?lock=24"
  },
  {
    id: 5,
    category: "aves",
    name: "Mistura Nutritiva para Aves",
    description: "Blend de sementes com vitaminas.",
    price: 26.9,
    image:
      "https://loremflickr.com/1200/800/bird-food?lock=25"
  },
  {
    id: 6,
    category: "roedores",
    name: "Casa para Hamster",
    description: "Mini habitat colorido com tunel.",
    price: 59.0,
    image:
      "https://loremflickr.com/1200/800/hamster?lock=13"
  },
  {
    id: 7,
    category: "roedores",
    name: "Feno Natural Premium",
    description: "Ideal para coelhos e porquinhos-da-india.",
    price: 31.0,
    image:
      "https://loremflickr.com/1200/800/rabbit?lock=14"
  },
  {
    id: 8,
    category: "aves",
    name: "Brinquedo para Calopsita",
    description: "Enriquecimento ambiental com cordas.",
    price: 21.5,
    image:
      "https://loremflickr.com/1200/800/parrot?lock=12"
  }
];

const serviceGrid = document.getElementById("service-grid");
const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartPanel = document.getElementById("cart-panel");
const openCartButton = document.getElementById("open-cart");
const closeCartButton = document.getElementById("close-cart");
const filterButtons = document.querySelectorAll(".filter-btn");
const checkoutForm = document.getElementById("checkout-form");
const orderResult = document.getElementById("order-result");
const goCheckout = document.getElementById("go-checkout");

let currentFilter = "todos";
let cart = [];

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderServices() {
  serviceGrid.innerHTML = services
    .map(
      (service) => `
        <article class="card">
          <img src="${service.image}" alt="${service.name}">
          <div class="card-content">
            <h4>${service.name}</h4>
            <p>${service.description}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProducts() {
  const filtered =
    currentFilter === "todos"
      ? products
      : products.filter((product) => product.category === currentFilter);

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="card">
          <img src="${product.image}" alt="${product.name}">
          <div class="card-content">
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <div class="price-row">
              <span class="price">${formatBRL(product.price)}</span>
              <button class="add-btn" data-id="${product.id}">Adicionar</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      addToCart(id);
    });
  });
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}

function changeQuantity(id, amount) {
  cart = cart
    .map((item) =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
    )
    .filter((item) => item.quantity > 0);

  updateCart();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

function updateCart() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = String(quantity);
  cartTotal.textContent = formatBRL(total);

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Seu carrinho esta vazio. Adicione produtos para continuar.</p>";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-row">
            <strong>${item.name}</strong>
            <button class="remove-btn" data-remove="${item.id}">Remover</button>
          </div>
          <small>${formatBRL(item.price)} cada</small>
          <div class="qty-controls">
            <button aria-label="Diminuir quantidade" data-dec="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button aria-label="Aumentar quantidade" data-inc="${item.id}">+</button>
          </div>
        </div>
      `
    )
    .join("");

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeItem(Number(button.dataset.remove)));
  });

  document.querySelectorAll("[data-inc]").forEach((button) => {
    button.addEventListener("click", () => changeQuantity(Number(button.dataset.inc), 1));
  });

  document.querySelectorAll("[data-dec]").forEach((button) => {
    button.addEventListener("click", () => changeQuantity(Number(button.dataset.dec), -1));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderProducts();
  });
});

openCartButton.addEventListener("click", () => {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
});

closeCartButton.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
});

goCheckout.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    orderResult.className = "order-result error";
    orderResult.textContent = "Seu carrinho esta vazio. Adicione produtos antes de finalizar.";
    return;
  }

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const pagamento = document.getElementById("pagamento").value;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!nome || !email || !endereco || !pagamento) {
    orderResult.className = "order-result error";
    orderResult.textContent = "Preencha todos os campos para concluir a simulacao.";
    return;
  }

  orderResult.className = "order-result success";
  orderResult.textContent = `Pedido simulado com sucesso, ${nome}! Total de ${formatBRL(total)}. Enviamos os detalhes para ${email}.`;

  checkoutForm.reset();
  cart = [];
  updateCart();
});

renderServices();
renderProducts();
updateCart();
