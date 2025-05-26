document.addEventListener("DOMContentLoaded", () => {
  // Buy New Books redirect
  document.getElementById("newBooks").addEventListener("click", () => {
    window.location.href = "buy-new-books.html";
  });

  // Used Books alert
  document.getElementById("usedBooks").addEventListener("click", () => {
    window.location.href = "buy-used-books.html";
  });

  // Stationary alert - fixed the ID to "stationary"
  document.getElementById("stationary").addEventListener("click", () => {
   window.location.href = "stationary.html";
  });

  // Smooth scroll for same-page links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // Adjust offset for navbar height
          behavior: "smooth"
        });
      }
    });
  });

  // Redirect to About page
  const aboutLink = document.getElementById("aboutLink");
  if (aboutLink) {
    aboutLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "about.html";
    });
  }
});



document.getElementById("logoutBtn").addEventListener("click", () => {
  // Clear any login/session data — assuming you store auth info in localStorage/sessionStorage
  localStorage.removeItem("user"); // or whatever key you use
  localStorage.removeItem("cart"); // optional, if you want to clear cart on logout

  // Redirect to login page
  window.location.href = "index.html";
});
