const itemsSection = document.getElementById("stationaryItemsSection");
const priceMinInput = document.getElementById("priceMin");
const priceMaxInput = document.getElementById("priceMax");
const categoryCheckboxes = document.querySelectorAll(".category");
const ratingRadios = document.querySelectorAll('input[name="rating"]');
const clearFiltersBtn = document.getElementById("clearFilters");

let items = [];

// Fetch items on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/api/stationary")
    .then(res => {
      console.log("STATUS:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("DATA:", data);
      items = data;
      filterItems();
    })
    .catch(err => {
      itemsSection.innerHTML = "<p>Failed to load stationary items.</p>";
      console.error("Fetch Error:", err);
    });
});

// Filter logic
function filterItems() {
  const min = parseFloat(priceMinInput.value) || 0;
  const max = parseFloat(priceMaxInput.value) || Infinity;
  const selectedCats = Array.from(categoryCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  const ratingThreshold = parseFloat(
    Array.from(ratingRadios).find(r => r.checked)?.value || 0
  );

  const filtered = items.filter(item =>
    item.price >= min &&
    item.price <= max &&
    (selectedCats.length === 0 || selectedCats.includes(item.category)) &&
    item.rating >= ratingThreshold
  );

  renderItems(filtered);
}

// Render cards
function renderItems(list) {
  itemsSection.innerHTML = "";

  if (list.length === 0) {
    itemsSection.innerHTML = "<p>No items found.</p>";
    return;
  }

  list.forEach(item => {
    const fullStars = "★".repeat(Math.floor(item.rating));
    const halfStar = item.rating % 1 >= 0.5 ? "½" : "";
    const stars = fullStars + halfStar;

    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="item-img" />
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>Brand: ${item.brand}</p>
        <p>₹${item.price}</p>
        <p>${stars}</p>
      </div>
      <div class="item-actions">
        <button class="buy-now-btn">Buy Now</button>
        <button class="add-cart-btn">Add to Cart</button>
      </div>
    `;

    // Add to Cart Button logic
    const addCartBtn = card.querySelector(".add-cart-btn");
    addCartBtn.addEventListener("click", () => {
      addToCart(item);
      updateCartCount();
    });

    itemsSection.appendChild(card);
  });
}

// Add to Cart function
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingIndex = cart.findIndex(cartItem =>
    cartItem.id === item.id ||
    (cartItem.name === item.name && cartItem.brand === item.brand && cartItem.price === item.price)
  );

  if (existingIndex !== -1) {
    alert("Item is already in your cart.");
  } else {
    item.quantity = 1;
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  }
}

// Event listeners for filters
[priceMinInput, priceMaxInput].forEach(input => input.addEventListener("input", filterItems));
categoryCheckboxes.forEach(cb => cb.addEventListener("change", filterItems));
ratingRadios.forEach(r => r.addEventListener("change", filterItems));

// Clear filters
clearFiltersBtn.addEventListener("click", () => {
  priceMinInput.value = "";
  priceMaxInput.value = "";
  categoryCheckboxes.forEach(cb => cb.checked = false);
  ratingRadios.forEach(r => r.checked = false);
  // Default back to 0 rating filter
  if (ratingRadios.length > 0) ratingRadios[ratingRadios.length - 1].checked = true;
  filterItems();
});


function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}



const cartIcon = document.getElementById("cartIcon");
const cartSidebar = document.getElementById("cartSidebar");
const closeCartBtn = document.getElementById("closeCartBtn");

cartIcon.addEventListener("click", () => {
  cartSidebar.classList.add("open");
  renderCartItems(); // optional: to update cart when opened
});

closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
});


