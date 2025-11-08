const cartButton = document.querySelectorAll('.cart-btn');
const cartModal = document.getElementById("cart-modal");

// Cart Button
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("cart-modal.html");
    const modalHTML = await response.text();
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Get modal element (must exist after insertion)
    const modal = document.getElementById("cartModal");
    if (!modal) {
      console.error("cartModal element not found after insertion.");
      return;
    }

    // Use querySelector on the modal to avoid ID collisions on the page
    const closeBtn = modal.querySelector("#closeModal") || modal.querySelector(".close-modal");
    const cartItems = modal.querySelector("#cartItems");
    const cartTotal = modal.querySelector("#cartTotal");

    function showModal() {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      // a11y
      modal.setAttribute("aria-hidden", "false");
      // optional: trap focus, disable page scroll
      document.documentElement.style.overflow = "hidden";
    }

    function hideModal() {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
    }

    // If closeBtn is missing, attach delegated handler to the modal itself
    if (closeBtn) {
      closeBtn.addEventListener("click", hideModal);
    } else {
      console.warn("closeBtn not found inside modal; using delegated listener as fallback.");
      // delegated fallback: clicks on anything with id closeModal or .close-modal
      document.addEventListener("click", (e) => {
        if (e.target.closest("#closeModal") || e.target.closest(".close-modal")) hideModal();
      });
    }

    // Clicking the backdrop outside modal content closes it
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal();
    });

    // Wire up any cart buttons on the page (both desktop and mobile)
    document.querySelectorAll(".cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showModal();
      });
    });

    //  keyboard support - close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) hideModal();
    });

    // show counts in console
    console.log("Cart modal loaded. closeBtn:", !!closeBtn, "cartBtns:", document.querySelectorAll(".cart-btn").length);

  } catch (err) {
    console.error("Failed to load cart modal:", err);
  }
});

// updating cart 

// cart.js - Complete Cart Management System

// Array to hold all cart items
let cartItems = [];

// Add item to cart
function addToCart(product) {
  // Check if item already exists in cart
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    // If exists, increase quantity
    existingItem.quantity += 1;
  } else {
    // If new, add to cart with quantity 1
    cartItems.push({
      ...product,
      quantity: 1
    });
  }
  
  // Update the cart display
  updateCartUI();
  
  // Save to localStorage
  saveCart();
  
  // Show notification
  showNotification(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
  // Filter out the item with matching id
  cartItems = cartItems.filter(item => item.id !== productId);
  
  // Update the display
  updateCartUI();
  
  // Save to localStorage
  saveCart();
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
  const item = cartItems.find(item => item.id === productId);
  
  if (item) {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove item
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      updateCartUI();
      saveCart();
    }
  }
}

// Calculate total price
function calculateTotal() {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

// Update the cart UI
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  const cartCountElement = document.getElementById('cartCount');
  
  // If cart is empty
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
    cartTotalElement.textContent = '₦0';
    if (cartCountElement) cartCountElement.textContent = '0';
    return;
  }
  
  // Generate HTML for each cart item
  cartItemsContainer.innerHTML = cartItems.map(item => `
    <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
      <!-- Product Image -->
      <img 
        src="${item.image}" 
        alt="${item.name}" 
        class="w-16 h-16 object-cover rounded"
      />
      
      <!-- Product Details -->
      <div class="flex-1">
        <h3 class="font-medium text-sm">${item.name}</h3>
        <p class="text-xs text-gray-600">₦${item.price.toLocaleString('en-NG')}</p>
        
        <!-- Quantity Controls -->
        <div class="flex items-center gap-2 mt-1">
          <button 
            onclick="updateQuantity('${item.id}', ${item.quantity - 1})"
            class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-sm transition-colors"
          >
            -
          </button>
          <span class="text-sm font-medium w-8 text-center">${item.quantity}</span>
          <button 
            onclick="updateQuantity('${item.id}', ${item.quantity + 1})"
            class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-sm transition-colors"
          >
            +
          </button>
        </div>
      </div>
      
      <!-- Remove Button -->
      <button 
        onclick="removeFromCart('${item.id}')"
        class="text-red-500 hover:text-red-700 transition-colors"
        title="Remove item"
      >
        <i class="fa-solid fa-trash text-sm"></i>
      </button>
    </div>
  `).join('');
  
  // Update total price
  const total = calculateTotal();
  cartTotalElement.textContent = `₦${total.toLocaleString('en-NG')}`;
  
  // Update cart count badge
  if (cartCountElement) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
  }
}

// Show notification when item is added
function showNotification(message) {
  // Check if notification already exists
  const existingNotification = document.querySelector('.cart-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cart-notification fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[10000] animate-slide-in';
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Open cart modal
function openCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    updateCartUI(); // Refresh cart display when opening
  }
}

// Close cart modal
function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Load cart from localStorage
function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    cartItems = JSON.parse(saved);
    updateCartUI();
  }
}

// Clear entire cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartItems = [];
    updateCartUI();
    saveCart();
    showNotification('Cart cleared!');
  }
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Load saved cart
  loadCart();
  
  // Set up close button
  const closeButton = document.getElementById('closeModal');
  if (closeButton) {
    closeButton.addEventListener('click', closeCartModal);
  }
  
  // Close modal when clicking backdrop
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      // Close if clicking the backdrop (not the modal content)
      if (e.target === modal) {
        closeCartModal();
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCartModal();
    }
  });
  
  console.log('Cart system initialized');
});

// Optional: Checkout function (you can customize this)
function checkout() {
  if (cartItems.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // You can add your checkout logic here
  // For now, just show an alert
  const total = calculateTotal();
  alert(`Checkout - Total: ₦${total.toLocaleString('en-NG')}\n\nThis would proceed to payment in a real application.`);
  
  //  Clear cart after checkout
  cartItems = [];
  updateCartUI();
  saveCart();
}