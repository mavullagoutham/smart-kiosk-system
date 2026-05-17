const API = "http://localhost:8080";

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageDiv = document.getElementById("message");

  if (!username || !password) {
    showMessage("Please fill in all fields", "error");
    return;
  }
  document.getElementById("loginLoader").style.display = "block";

  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loginLoader").style.display = "none";
      if (data.success) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", username);
        
        if(!localStorage.getItem(username + "_cart")){
          localStorage.setItem(username + "_cart", JSON.stringify([]));
        }

        if(!localStorage.getItem(username + "_history")){
          localStorage.setItem(username + "_history", JSON.stringify([]));
        }

        localStorage.setItem("token", data.token);
        showMessage("Login successful! Redirecting...", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        showMessage(data.message || "Invalid credentials", "error");
      }
    })
    .catch(() => {
      document.getElementById("loginLoader").style.display = "none";
      showMessage("Server error. Please try again later.", "error");
    });
}

window.addEventListener("load", () => {

  setTimeout(() => {
    let loader = document.getElementById("screenLoader");

    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    },500);

  },1500);

});

setInterval(() => {

    let now = new Date();

    document.getElementById("liveClock").innerText =
    now.toLocaleTimeString();

},1000);

function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters", "error");
    return;
  }

  fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {

    if (data.success) {
      let users = JSON.parse(localStorage.getItem("allUsers")) || [];

      if(users.includes(username)){
        showMessage("Username already exists", "error");
        return;
      }

      users.push(username);
      localStorage.setItem("allUsers", JSON.stringify(users));

      showMessage("Registration successful! Please login.", "success");
    } else {
        showMessage(data.message || "Registration failed", "error");
      }
    })
    .catch(() => {
      showMessage("Server error. Please try again later.", "error");
    });
}

function searchMenu(){
  let value = document.getElementById("menuSearch").value.toLowerCase();

  let cards = document.querySelectorAll(".card");

  cards.forEach(card => {

      let text = card.innerText.toLowerCase();

      if(text.includes(value)){
          card.style.display = "block";
      }else{
          card.style.display = "none";
      }
  });
}

function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  if (messageDiv) {
    messageDiv.innerText = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 4000);
  }
}

const images = {
  "Burger": "images/burger.jpg",
  "Pizza": "images/pizza.jpg",
  "Sandwich": "images/sandwich.jpg",
  "Pasta": "images/pasta.jpg",
  "French Fries": "images/frenchfries.jpg",
  "Cold Coffee": "images/coldcoffee.jpg",
  "Ice Cream": "images/icecream.jpg"
};

const userId = localStorage.getItem("userId");
const currentUser = localStorage.getItem("username");

let cart =
JSON.parse(
localStorage.getItem(currentUser + "_cart")
) || [];

let orders =
JSON.parse(
localStorage.getItem(currentUser + "_orders")
) || [];

function addToCart(item, price) {
  cart.push({item, price});
  localStorage.setItem(currentUser + "_cart", JSON.stringify(cart));
  updateCartUI();
  renderCart();
  loadBill();
}

function updateCartUI() {
    document.getElementById("cartCount").innerText = cart.length;
}

function scrollChat() {
  let chat = document.getElementById("chatMessages");
  chat.scrollTop = chat.scrollHeight;
}

// NAVIGATION
function showSection(sectionId, element) {

    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });

    document.querySelectorAll(".nav-card").forEach(card => {
        card.classList.remove("active-nav");
    });

    document.getElementById(sectionId).classList.add("active");
    document.getElementById("welcomeUser").innerText =
      "Welcome, " + localStorage.getItem("username");
    const titles = {
    dashboard: "✨ Smart Kiosk Dashboard",
    menu: "🍔 Food Menu",
    cart: "🛒 Shopping Cart",
    orders: "📦 Order History",
    bill: "💳 Payment Center",
    about: "ℹ About Smart Kiosk",
    contact: "📍 Contact Us",
    locations: "📍 Nearby Branches",
    settings: "⚙ System Settings",
    history: "📜 Payment History"
};

document.getElementById("pageTitle").innerText =
titles[sectionId];

    if(element){
        element.classList.add("active-nav");
    }
}

// LOAD MENU
if(document.getElementById("menuFull")){

fetch(API + "/getMenu")
  .then(res => res.json())
  .then(data => {

    let full = document.getElementById("menuFull");

    full.innerHTML = "";

    data.forEach(item => {

      let key = item.name.trim();

      let image =
        images[item.name] ||
        images[key] ||
        "images/default.jpg";

      let card = `
        <div class="card">
          <img src="${image}">
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>

          <button onclick="order('${item.name}', ${item.price})">
            Order
          </button>

          <button onclick="addToCart('${item.name}', ${item.price})">
            Add to Cart
          </button>
        </div>
      `;

      full.innerHTML += card;
    });

  })
  .catch(() => {

    document.getElementById("menuFull").innerHTML = "⚠ Server not responding";

  });
}

// ORDER
function order(item, price) {
  
  fetch(`${API}/placeOrder?item=${item}&price=${price}&user=${userId}`)
        .then(res => res.text())
        .then(() => {

            localStorage.setItem("lastOrderTime", Date.now());

            loadOrders();
            loadBill();   

            showSuccess(); // better UX
        });
}

function showSuccess() {
  const div = document.createElement("div");
  div.innerHTML = "✅ Order Placed Successfully!";
  div.style.position = "fixed";
  div.style.top = "20px";
  div.style.right = "20px";
  div.style.background = "#00c6ff";
  div.style.padding = "15px";
  div.style.borderRadius = "10px";
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 2500);
}

function toggleTheme(){
  document.body.classList.toggle("light");

  if(document.body.classList.contains("light")){
      localStorage.setItem("theme","light");
  }else{
      localStorage.setItem("theme","dark");
  }
}

function showDetails(item) {
    showSection("details");
}

// ORDERS
function loadOrders() {
  fetch(`${API}/getOrders?user=${userId}`)
    .then(res => res.json())
    .then(data => {
      orders = data;
      let html = "";
        if (data.length === 0) {
          document.getElementById("ordersList").innerHTML = "<p>No orders yet 🍽️</p>";
          return;
        }
        
        data.forEach(o => {
        html += `
          <div class="order-card">
            <div class="order-left">
              
              <h3>${getEmoji(o.item)} ${o.item}</h3>
              <p>₹${o.price}</p>
              
              <span class="meta">#ORD${o.id || Math.floor(Math.random()*1000)} • ${getTimeAgo(localStorage.getItem("lastOrderTime"))}</span>
              </div>

            <div class="order-right">
              <span class="status delivered">● Delivered</span>
            </div>
          </div>  `;
            });

            document.getElementById("ordersList").innerHTML = html;
    });
}

function getEmoji(item) {
  if (item.includes("Burger")) return "🍔";
  if (item.includes("Pizza")) return "🍕";
  if (item.includes("Coffee")) return "☕";
  if (item.includes("Ice")) return "🍨";
  return "🍽️";
}

function getTimeAgo(time) {
  if (!time) return "Just now";

  const diff = Math.floor((Date.now() - time) / 1000);

  if (diff < 60) return diff + " sec ago";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  return Math.floor(diff / 3600) + " hr ago";
}

// AI
function toggleChat() {
  let box = document.getElementById("chatBox");
  if (box.style.display === "flex") {
    box.style.display = "none";
  } else {
    box.style.display = "flex";
  }
}

function renderCart() {
    let div = document.getElementById("cartItems");
    document.getElementById("cartCountDash").innerText = cart.length;
    document.getElementById("dashboardCartCount").innerText = cart.length;
    div.innerHTML = "";
    
    if (cart.length === 0) {
      div.innerHTML = "<p>Your cart is empty 🛒</p>";
      return;
    }
    let total = 0;

    cart.forEach((c, index) => {
        div.innerHTML += `
        <div class="cart-item">
          <div class="cart-info">
            <h4>${c.item}</h4>
            <p>₹${c.price}</p>
          </div>
          <button onclick="removeFromCart(${index})">✖</button>
        </div>
          `;
        total += c.price;
    });

    div.innerHTML += `<h3 class="total">Total: ₹${total}</h3>`;

}

function loadBill(){
  let subtotal = 0;

  cart.forEach(c => {

      subtotal += c.price;

  });

  let gst = Math.round(subtotal * 0.05);
  let finalTotal = subtotal + gst;

  document.getElementById("subtotalAmount").innerText = "₹" + subtotal;
  document.getElementById("gstAmount").innerText = "₹" + gst;
  document.getElementById("totalAmount").innerText = "₹" + finalTotal;
}

function addMessage(text, type) {
  let chat = document.getElementById("chatMessages");

  let msg = document.createElement("div");
  msg.className = "message " + type;
  msg.innerText = text;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function placeOrderFromCart() {
  Promise.all(
    cart.map(c =>
        fetch(`${API}/placeOrder?item=${c.item}&price=${c.price}&user=${userId}`)
    )
  ).then(() => {

    cart = [];
    localStorage.removeItem(currentUser + "_cart");

    updateCartUI();
    renderCart();

    loadOrders();
    loadBill();   

    alert("Order placed successfully!");
  });
}
function askAI() {
  let input = document.getElementById("query");
  let q = input.value.toLowerCase();

  addMessage(q, "user");

  let response = "I'm here to help 😊";

  if (q.includes("hi")) response = "Hi 👋 Welcome to Smart Kiosk! What would you like today?";
  else if (q.includes("burger")) response = "Burger 🍔 is juicy and popular!";
  else if (q.includes("menu")) response = "We have Burger, Pizza, Pasta...";
  else if (q.includes("order")) response = "Go to Menu and click Order 🍽️";
  else if (q.includes("hello")) response = "Hey! Hungry? 😄";
  else if (q.includes("pizza")) response = "Pizza 🍕 is our bestseller!";
  else if (q.includes("cheap")) response = "Try Sandwich or Ice Cream 💸";
  else if (q.includes("suggest")) response = "🔥 I recommend Pizza or Pasta!";
  else if (q.includes("bill")) response = "Your current bill is displayed in the Billing section 🧾";
  else if (q.includes("hungry")) response = "😋 You're hungry! Try Pizza or Burger!";
  else if (q.includes("drink")) response = "🥤 Cold Coffee is refreshing!";
  else if (q.includes("sweet")) response = "🍨 Ice Cream is perfect!";
  else response = "I can help you choose food or answer queries 😊";

  setTimeout(() => {
    addMessage(response, "bot");
  }, 500);

  input.value = "";
}

function resetUser() {
    localStorage.removeItem("userId");
    location.reload();
}

function loadDashboard() {
  fetch(`${API}/getOrders?user=${userId}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalOrders").innerText =
      data.length;

      let total = 0;

      data.forEach(o => total += o.price);

      document.getElementById("totalRevenue").innerText =
      "₹" + total;

      let activeUser = localStorage.getItem("userId");

      document.getElementById("activeUsers").innerText = activeUser ? 1 : 0;
  });
}

function payNow() {
    const amount =
        document.getElementById("totalAmount").innerText;

    alert(
        "Payment of " + amount + " Successful ✅"
    );
}

function showPaymentPopup(){

    let orderId = "#ORD" + Math.floor(Math.random()*1000);

    document.getElementById("popupOrderId").innerText =
    orderId;

    document.getElementById("paymentPopup").style.display =
    "flex";

    document.getElementById("paymentLoader").style.display =
    "block";

    document.getElementById("paymentSuccess").style.display =
    "none";

    setTimeout(() => {

        document.getElementById("paymentLoader").style.display =
        "none";

        document.getElementById("paymentSuccess").style.display =
        "block";

    }, 2000);
}

function saveHistory(){
  let history = JSON.parse(
      localStorage.getItem(currentUser + "_history")
  ) || [];

  cart.forEach(c => {

      history.push({
          item: c.item,
          price: c.price,
          time: new Date().toLocaleString()
      });

  });

  localStorage.setItem(
      currentUser + "_history",
      JSON.stringify(history)
  );
}

function logout(){
  let confirmLogout = confirm("Are you sure you want to logout?");

  if(confirmLogout){

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      window.location.href = "login.html";
  }
}

function closePopup(){

    // SAVE PAYMENT HISTORY
    saveHistory();

    // CLEAR ONLY CART
    cart = [];

    localStorage.removeItem(
        currentUser + "_cart"
    );

    // UPDATE UI
    updateCartUI();

    renderCart();

    // RELOAD DATA
    loadOrders();

    loadBill();

    loadHistory();

    // CLOSE POPUP
    document.getElementById(
        "paymentPopup"
    ).style.display = "none";

    showCartPopup(
      "Payment Completed Successfully ✅"
    );
}

function loadHistory(){

    let history = JSON.parse(
        localStorage.getItem(currentUser + "_history")
    ) || [];

    let div = document.getElementById("historyList");

    if(history.length === 0){

        div.innerHTML = "<p>🧾 No completed payments yet</p>";

        return;
    }

    let html = "";
    html += `<h3>Total Payments: ${history.length}</h3>`;
    history.forEach(h => {

        html += `
        <div class="order-card">
            <div class="order-left">
                <h3>${h.item}</h3>
                <p>₹${h.price}</p>
                <span class="meta">${h.time}</span>
            </div>

            <div class="order-right">
                <span class="status delivered">
                    Paid
                </span>
            </div>
        </div>
        `;
    });

    div.innerHTML = html;
}

function removeFromCart(index) {
  cart.splice(index, 1);

  localStorage.setItem(currentUser + "_cart",JSON.stringify(cart));

  updateCartUI();
  renderCart();
  loadBill();
}

function clearCart(){
  if(cart.length === 0){
    alert("Cart is already empty 🛒");
    return;
  }

   let confirmClear = confirm("Are you sure you want to clear the cart?");

  if(confirmClear){

    cart = [];
    localStorage.removeItem(currentUser + "_cart");
    updateCartUI();
    renderCart();
    loadBill();
    showCartPopup(
    "Cart cleared successfully 🗑️"
    );
  }
}

function showCartPopup(message){
  const popup = document.createElement("div");
  popup.className = "cart-popup";
  popup.innerText = message;
  document.body.appendChild(popup);
  
  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform =
    "translateY(-20px)";
    setTimeout(() => {
        popup.remove();
    },500);
  },2000);
}

setTimeout(() => {

    let popup = document.getElementById("festivalPopup");

    let today = new Date();

    let month = today.getMonth() + 1;

    let message ="😊 Happy to use Smart Kiosk!";

    // Diwali example
    if(month === 11){
        message =
        "🪔 Happy Diwali! Enjoy your meal 🍔";
    }

    // Pongal example
    else if(month === 1){
        message =
        "🌾 Happy Pongal from Smart Kiosk!";
    }

    popup.innerText = message;

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    },5000);

},45000);

if(localStorage.getItem("theme") === "light"){
    document.body.classList.add("light");
}

// INIT
if(document.getElementById("dashboard")){

  updateCartUI();

  renderCart();

  showSection("dashboard", document.querySelectorAll(".nav-card")[0]);

  loadDashboard();

  loadOrders();

  loadBill();

  loadHistory();
}