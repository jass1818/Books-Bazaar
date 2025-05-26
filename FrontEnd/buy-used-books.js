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
    fetch("http://localhost:8080/api/used-books")
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
       <p class="book-price">
  <span class="offer-price">₹${book.offerprice}</span>
  <span class="original-price">₹<s>${book.originalprice}</s></span>
</p>
        <p class="book-rating">${stars}</p>
      </div>
      <div class="book-actions">
        <button class="buy-now-btn">Buy Now</button>
        <button class="add-cart-btn">Add to Cart</button>
      </div>
    `;
        booksSection.appendChild(bookCard);
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
    console.log("Books before filtering:", books);

    const priceMin = priceMinInput.value ? parseFloat(priceMinInput.value) : null;
    const priceMax = priceMaxInput.value ? parseFloat(priceMaxInput.value) : null;

    const selectedGenres = getSelectedGenres();
    const ratingThreshold = getSelectedRating();

    const filtered = books.filter(book => {
        const matchesPriceMin = priceMin === null || book.offerprice >= priceMin;
        const matchesPriceMax = priceMax === null || book.offerprice <= priceMax;
        const matchesPrice = matchesPriceMin && matchesPriceMax;

        const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.genre);
        const matchesRating = book.rating >= ratingThreshold;

        return matchesPrice && matchesGenre && matchesRating;
    });

    console.log("Books after filtering:", filtered);
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



// Cart functionality
let cartItems = [];

const cartSidebar = document.getElementById("cartSidebar");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotal = document.getElementById("cartTotal");

// Toggle Cart Sidebar
openCartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));

// Event delegation for book cards
booksSection.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("add-cart-btn")) {
    const bookCard = target.closest(".book-card");
    const title = bookCard.querySelector(".book-title").textContent;
    const price = parseFloat(bookCard.querySelector(".offer-price").textContent.replace("₹", ""));
    const img = bookCard.querySelector(".book-img").src;

    const existing = cartItems.find(item => item.title === title);
    if (existing) {
      existing.quantity++;
    } else {
      cartItems.push({ title, price, quantity: 1, img });
    }

    renderCart();
  }

  if (target.classList.contains("buy-now-btn")) {
    alert("Redirect to payment page or logic here.");
  }
});

// Render Cart
function renderCart() {
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: ₹0";
    return;
  }

  cartItemsContainer.innerHTML = "";

  cartItems.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div>₹${item.price} x ${item.quantity}</div>
        <div class="quantity-controls">
          <button onclick="changeQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="remove-btn" onclick="removeItem(${index})">✖</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  updateTotal();
}

// Quantity change
window.changeQuantity = function (index, delta) {
  cartItems[index].quantity += delta;
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  renderCart();
};

// Remove item
window.removeItem = function (index) {
  cartItems.splice(index, 1);
  renderCart();
};

// Update total
function updateTotal() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
}
