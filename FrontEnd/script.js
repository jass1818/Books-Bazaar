// Panel switching logic
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Sign In Form Logic (connected to backend)
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = e.target[0].value;
  const password = e.target[1].value;

  try {
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const msg = await res.text();

    if (res.ok) {
      alert("Login successful!");
      // Redirect to home page after login
      window.location.href = "home.html";
    } else {
      alert(msg || "Invalid username or password.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Server error. Please try again later.");
  }
});

// Sign Up Form Logic (connected to backend)
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const newUser = {
    username: e.target[0].value,
    email: e.target[1].value,
    password: e.target[2].value
  };

  try {
    const res = await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    const msg = await res.text();

    if (res.ok) {
      alert("Signup successful! You can now sign in.");
      container.classList.remove("right-panel-active"); // Switch to Sign In form
      // Redirect to home page after signup
      window.location.href = "home.html";
    } else {
      alert(msg || "Signup failed.");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Server error. Please try again later.");
  }
});
