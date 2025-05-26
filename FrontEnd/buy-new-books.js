// DOM refs
const booksSection = document.getElementById("booksSection");
const priceMinInput = document.getElementById("priceMin");
const priceMaxInput = document.getElementById("priceMax");
const genreCheckboxes = document.querySelectorAll(".genre");
const ratingRadios = document.querySelectorAll('input[name="rating"]');
const clearFiltersBtn = document.getElementById("clearFilters");

let books = [];

// Fetch books from Spring Boot backend
window.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/api/books")
    .then(response => response.json())
    .then(data => {
      books = data;
      filterBooks(); // Now use backend data
    })
    .catch(err => {
      console.error("Failed to fetch books:", err);
      booksSection.innerHTML = "<p>Failed to load books.</p>";
    });
});

// Render books based on filter
function renderBooks(filteredBooks) {
  booksSection.innerHTML = "";
  if (filteredBooks.length === 0) {
    booksSection.innerHTML = "<p>No books match your filters.</p>";
    return;
  }

  filteredBooks.forEach(book => {
    const stars = "★".repeat(Math.floor(book.rating)) + (book.rating % 1 >= 0.5 ? "½" : "");
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.innerHTML = `
      <img src="${book.img}" alt="${book.title}" class="book-img" />
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <p class="book-price">₹${book.price}</p>
        <p class="book-rating">${stars}</p>
      </div>
      <div class="book-actions">
        <button class="buy-now-btn">Buy Now</button>
        <button class="add-cart-btn">Add to Cart</button>
      </div>
    `;
    booksSection.appendChild(bookCard);

    const addCartBtn = bookCard.querySelector(".add-cart-btn");
    addCartBtn.addEventListener("click", () => {
      addToCart(book);
    });
  });
}

// Get selected genres
function getSelectedGenres() {
  return Array.from(genreCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}

// Get selected rating threshold
function getSelectedRating() {
  const selected = Array.from(ratingRadios).find(r => r.checked);
  return selected ? parseFloat(selected.value) || 0 : 0;
}

// Filter books logic
function filterBooks() {
  const priceMin = priceMinInput.value ? parseFloat(priceMinInput.value) : null;
  const priceMax = priceMaxInput.value ? parseFloat(priceMaxInput.value) : null;

  const selectedGenres = getSelectedGenres();
  const ratingThreshold = getSelectedRating();

  const filtered = books.filter(book => {
    const matchesPriceMin = priceMin === null || book.price >= priceMin;
    const matchesPriceMax = priceMax === null || book.price <= priceMax;
    const matchesPrice = matchesPriceMin && matchesPriceMax;

    const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.genre);
    const matchesRating = book.rating >= ratingThreshold;

    return matchesPrice && matchesGenre && matchesRating;
  });

  renderBooks(filtered);
}

// Event listeners
priceMinInput.addEventListener("input", filterBooks);
priceMaxInput.addEventListener("input", filterBooks);
genreCheckboxes.forEach(cb => cb.addEventListener("change", filterBooks));
ratingRadios.forEach(radio => radio.addEventListener("change", filterBooks));

clearFiltersBtn.addEventListener("click", () => {
  priceMinInput.value = "";
  priceMaxInput.value = "";
  genreCheckboxes.forEach(cb => (cb.checked = false));
  ratingRadios.forEach(r => (r.checked = false));
  ratingRadios[ratingRadios.length - 1].checked = true; // Reset to "Any rating"
  filterBooks();
});


// NAVBAR SEARCH
document.getElementById("navSearchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("navSearchInput").value.toLowerCase().trim();
  const searchHeading = document.getElementById("searchResultsHeading");
  if (!query) return;

  const allEndpoints = [
    "http://localhost:8080/api/books",
    "http://localhost:8080/api/used-books",
    "http://localhost:8080/api/stationary"
  ];

  Promise.all(allEndpoints.map(url => fetch(url).then(res => res.json())))
    .then(([books, usedBooks, stationary]) => {
      const allItems = [...books, ...usedBooks, ...stationary];
      const results = allItems.filter(item =>
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.author && item.author.toLowerCase().includes(query)) ||
        (item.brand && item.brand.toLowerCase().includes(query))
      );

      renderSearchResults(results, query);
    })
    .catch(err => {
      console.error("Search fetch error:", err);
      alert("Something went wrong while searching.");
    });
});

// Render search results
function renderSearchResults(results, query) {
  const booksSection = document.getElementById("booksSection");
  const searchHeading = document.getElementById("searchResultsHeading");

  booksSection.innerHTML = "";
  searchHeading.textContent = `Search Results for "${query}"`;

  if (results.length === 0) {
    booksSection.innerHTML = "<p>No items found matching your search.</p>";
    return;
  }

  results.forEach(item => {
    const stars = "★".repeat(Math.floor(item.rating)) + (item.rating % 1 >= 0.5 ? "½" : "");
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name || item.title}" class="book-img" />
      <div class="book-info">
        <h3 class="book-title">${item.name || item.title}</h3>
        ${item.author ? `<p class="book-author">by ${item.author}</p>` : ""}
        ${item.brand ? `<p class="book-author">Brand: ${item.brand}</p>` : ""}
        <p class="book-price">₹${item.price}</p>
        <p class="book-rating">${stars}</p>
      </div>
      <div class="book-actions">
        <button class="buy-now-btn">Buy Now</button>
        <button class="add-cart-btn">Add to Cart</button>
      </div>
    `;
    booksSection.appendChild(card);

    const addCartBtn = card.querySelector(".add-cart-btn");
    addCartBtn.addEventListener("click", () => {
      addToCart(item);
    });
  });
}



// ✅ Add To Cart Function (shared for books + search)
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const isDuplicate = cart.some(cartItem =>
    cartItem.id === item.id || (
      cartItem.name === item.name &&
      cartItem.title === item.title &&
      cartItem.price === item.price
    )
  );

  if (!isDuplicate) {
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  } else {
    alert("Item is already in your cart.");
  }
}






const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotal = document.getElementById("cartTotal");

// Open cart sidebar
openCartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("open");
  openCartBtn.style.display = "none";  // Hide the open cart button
  renderCartItems();
});

// Close cart sidebar
closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  openCartBtn.style.display = "flex"; // Show the open cart button again
});

// Render cart items with quantity controls
function renderCartItems() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: ₹0";
    return;
  }

  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title || item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controls">
          <button class="qty-decrease" data-index="${index}">-</button>
          <span class="qty-count">${item.quantity || 1}</span>
          <button class="qty-increase" data-index="${index}">+</button>
        </div>
        <button class="remove-btn" data-index="${index}">❌</button>
      </div>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  // Attach Increase/Decrease Events
  document.querySelectorAll(".qty-increase").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].quantity = (cart[index].quantity || 1) + 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartItems();
      updateTotalPrice();
    });
  });

  document.querySelectorAll(".qty-decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems();
        updateTotalPrice();
      }
    });
  });

  // Attach Remove Event
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartItems();
      updateTotalPrice();
      updateCartCount();
    });
  });

  updateTotalPrice();
}


// Update item quantity in localStorage and update total price
function updateCartItemQuantity(index, newQty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity = newQty;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateTotalPrice();
}

// Calculate and display total price
function updateTotalPrice() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = cart.reduce((sum, item) => {
    return sum + (item.price * (item.quantity || 1));
  }, 0);
  cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
}

// Buy all items from cart
document.getElementById("buyNowAllBtn").addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // You can replace this alert with actual backend call
  alert("Thanks for your purchase! 🎉");

  // Clear cart
  localStorage.removeItem("cart");
  renderCartItems();
  updateTotalPrice();
});

// When adding an item to cart, default quantity to 1
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingIndex = cart.findIndex(cartItem =>
    cartItem.id === item.id ||
    (cartItem.name === item.name && cartItem.title === item.title && cartItem.price === item.price)
  );

  if (existingIndex !== -1) {
    alert("Item is already in your cart.");
  } else {
    item.quantity = 1; // default quantity 1 on add
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  }
}

document.querySelectorAll(".remove-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const itemId = btn.getAttribute("data-id");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => item.id !== itemId); // remove item
    localStorage.setItem("cart", JSON.stringify(cart));

    renderCartItems();      // refresh UI
    updateTotalPrice();
    updateCartCount();
  });
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = count;
}

