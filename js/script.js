// ===== CONFIGURATION =====
const CONFIG = {
  ANIMATION_DURATION: 300,
  CART_ANIMATION_DURATION: 400,
  MESSAGE_DISPLAY_TIME: 3000,
  DEBOUNCE_DELAY: 300
};

// ===== PRODUCTS DATA =====
const products = [
  { 
    name: 'FIFA 25', 
    price: 56000, 
    image: 'image/fifa.avif', 
    id: 1, 
    category: 'sports',
    description: 'El simulador de fútbol más realista del mercado',
    rating: 4.8,
    stock: 15
  },
  { 
    name: 'PES 2025', 
    price: 70000, 
    image: 'image/pes.jpg', 
    id: 2, 
    category: 'sports',
    description: 'Pro Evolution Soccer con gráficos mejorados',
    rating: 4.6,
    stock: 8
  },
  { 
    name: 'CALL OF DUTTY', 
    price: 80000, 
    image: 'image/call-of-dutty.jpg', 
    id: 3, 
    category: 'action',
    description: 'Acción militar en primera persona',
    rating: 4.9,
    stock: 20
  },
  { 
    name: 'FORMULA 1', 
    price: 35000, 
    image: 'image/formula-1.jpg', 
    id: 4, 
    category: 'sports',
    description: 'Simulador oficial de Fórmula 1',
    rating: 4.7,
    stock: 12
  },
  { 
    name: 'GOD OF WAR', 
    price: 15000, 
    image: 'image/god-of-war.jpg', 
    id: 5, 
    category: 'adventure',
    description: 'Aventura épica de la mitología nórdica',
    rating: 4.9,
    stock: 25
  },
  { 
    name: 'MORTAL KOMBAT 11', 
    price: 99000, 
    image: 'image/mortal-kombat.jpg', 
    id: 6, 
    category: 'action',
    description: 'Lucha brutal con gráficos espectaculares',
    rating: 4.5,
    stock: 18
  },
  { 
    name: 'TOM CLANCY\'S RAINBOW SIEGE', 
    price: 12000, 
    image: 'image/tom-clancy-rainbow-six.jpg', 
    id: 7, 
    category: 'action',
    description: 'Tácticas de combate táctico',
    rating: 4.4,
    stock: 30
  },
  { 
    name: 'RESIDENT EVIL 4 REMAKE', 
    price: 49000, 
    image: 'image/resident-evil.webp', 
    id: 8, 
    category: 'adventure',
    description: 'Terror y supervivencia reimaginados',
    rating: 4.8,
    stock: 22
  },
  { 
    name: 'NBA 25', 
    price: 99000, 
    image: 'image/nba.jpg', 
    id: 9, 
    category: 'sports',
    description: 'Baloncesto profesional con IA avanzada',
    rating: 4.6,
    stock: 14
  },
  { 
    name: 'SPIDERMAN', 
    price: 50000, 
    image: 'image/spiderman.jpg', 
    id: 10, 
    category: 'adventure',
    description: 'Aventura del superhéroe arácnido',
    rating: 4.7,
    stock: 16
  },
  { 
    name: 'GTA V', 
    price: 66000, 
    image: 'image/gta.jpg', 
    id: 11, 
    category: 'action',
    description: 'Mundo abierto criminal épico',
    rating: 4.8,
    stock: 35
  },
  { 
    name: 'SILENT HILL', 
    price: 52000, 
    image: 'image/silent-hill.jpg', 
    id: 12, 
    category: 'adventure',
    description: 'Terror psicológico clásico',
    rating: 4.3,
    stock: 10
  }
];

// ===== STATE MANAGEMENT =====
class AppState {
  constructor() {
    this.cart = this.loadCart();
    this.currentFilter = 'all';
    this.isLoading = false;
  }

  loadCart() {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }
}

// ===== UTILITY FUNCTIONS =====
const utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  },

  showMessage(message, type = 'success') {
    const messageElement = document.getElementById(`${type}-message`);
    const textElement = messageElement.querySelector('.message-text');
    
    textElement.textContent = message;
    messageElement.style.display = 'flex';
    
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, CONFIG.MESSAGE_DISPLAY_TIME);
  },

  showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
  },

  animateElement(element, animation, duration = CONFIG.ANIMATION_DURATION) {
    element.style.animation = `${animation} ${duration}ms ease-out`;
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  }
};

// ===== DOM ELEMENTS =====
const elements = {
  productList: document.getElementById('product-list'),
  cartContainer: document.getElementById('cart-container'),
  cartItems: document.getElementById('cart-items'),
  cartTotal: document.getElementById('cart-total'),
  cartCount: document.getElementById('cart-count'),
  contactForm: document.getElementById('contact-form'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  navbar: document.querySelector('.navbar'),
  menuToggle: document.getElementById('menu')
};

// ===== APP STATE =====
const appState = new AppState();

// ===== PRODUCT MANAGEMENT =====
class ProductManager {
  constructor() {
    this.products = products;
    this.filteredProducts = [...products];
  }

  filterProducts(category) {
    if (category === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => product.category === category);
    }
    this.renderProducts();
  }

  renderProducts() {
    elements.productList.innerHTML = '';
    
    if (this.filteredProducts.length === 0) {
      elements.productList.innerHTML = `
        <div class="no-products">
          <h3>No se encontraron productos</h3>
          <p>Intenta con otra categoría</p>
        </div>
      `;
      return;
    }

    this.filteredProducts.forEach(product => {
      const productCard = this.createProductCard(product);
      elements.productList.appendChild(productCard);
    });
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-overlay">
          <button class="quick-view-btn" data-id="${product.id}">Vista rápida</button>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          <div class="rating">
            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
            <span>${product.rating}</span>
          </div>
          <span class="stock">Stock: ${product.stock}</span>
        </div>
        <p class="product-price">${utils.formatPrice(product.price)}</p>
        <button class="add-to-cart-btn" data-id="${product.id}">
          <span>Agregar al carrito</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </button>
      </div>
    `;

    // Add event listeners
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => this.addToCart(product.id));

    const quickViewBtn = card.querySelector('.quick-view-btn');
    quickViewBtn.addEventListener('click', () => this.showQuickView(product));

    return card;
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = appState.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      appState.cart.push({ ...product, quantity: 1 });
    }

    appState.saveCart();
    cartManager.renderCart();
    utils.showMessage(`${product.name} agregado al carrito`);
    utils.animateElement(elements.cartCount, 'pulse');
  }

  showQuickView(product) {
    // Implementation for quick view modal
    console.log('Quick view for:', product.name);
  }
}

// ===== CART MANAGEMENT =====
class CartManager {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.quantity-btn')) {
        const button = e.target.closest('.quantity-btn');
        const id = parseInt(button.dataset.id);
        const action = button.dataset.action;
        this.changeQuantity(id, action);
      } else if (e.target.closest('.remove-btn')) {
        const button = e.target.closest('.remove-btn');
        const id = parseInt(button.dataset.id);
        this.removeFromCart(id);
      }
    });
  }

  renderCart() {
    elements.cartItems.innerHTML = '';
    elements.cartCount.textContent = appState.getCartCount();

    if (appState.cart.length === 0) {
      elements.cartItems.innerHTML = `
        <div class="empty-cart">
          <p>Tu carrito está vacío</p>
          <button class="btn-primary" onclick="toggleCart()">Continuar comprando</button>
        </div>
      `;
      elements.cartTotal.textContent = `Total: ${utils.formatPrice(0)}`;
      return;
    }

    appState.cart.forEach(item => {
      const itemElement = this.createCartItem(item);
      elements.cartItems.appendChild(itemElement);
    });

    elements.cartTotal.textContent = `Total: ${utils.formatPrice(appState.getCartTotal())}`;
  }

  createCartItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    
    itemDiv.innerHTML = `
      <div class="cart-item-details">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${utils.formatPrice(item.price * item.quantity)}</span>
      </div>
      <div class="cart-item-actions">
        <button class="quantity-btn" data-id="${item.id}" data-action="decrease" aria-label="Reducir cantidad">-</button>
        <span class="quantity-display">${item.quantity}</span>
        <button class="quantity-btn" data-id="${item.id}" data-action="increase" aria-label="Aumentar cantidad">+</button>
        <button class="remove-btn" data-id="${item.id}" data-action="remove" aria-label="Eliminar del carrito">×</button>
      </div>
    `;

    return itemDiv;
  }

  changeQuantity(productId, action) {
    const item = appState.cart.find(item => item.id === productId);
    if (!item) return;

    if (action === 'increase') {
      item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity--;
    }

    appState.saveCart();
    this.renderCart();
  }

  removeFromCart(productId) {
    const index = appState.cart.findIndex(item => item.id === productId);
    if (index !== -1) {
      const removedItem = appState.cart[index];
      appState.cart.splice(index, 1);
      appState.saveCart();
      this.renderCart();
      utils.showMessage(`${removedItem.name} eliminado del carrito`, 'error');
    }
  }

  emptyCart() {
    appState.cart = [];
    appState.saveCart();
    this.renderCart();
    toggleCart();
    utils.showMessage('Carrito vaciado');
  }

  checkout() {
    if (appState.cart.length === 0) {
      utils.showMessage('Tu carrito está vacío', 'error');
      return;
    }

    utils.showLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      utils.showLoading(false);
      utils.showMessage('¡Compra realizada con éxito! Gracias por tu compra.');
      this.emptyCart();
    }, 2000);
  }
}

// ===== FORM MANAGEMENT =====
class FormManager {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    elements.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', utils.debounce(() => this.validateField(input), CONFIG.DEBOUNCE_DELAY));
    });
  }

  validateField(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('error');
    errorElement.textContent = '';

    // Validation rules
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Email inválido';
      }
    } else if (field.type === 'text' && field.value.length < 2) {
      isValid = false;
      errorMessage = 'Mínimo 2 caracteres';
    }

    // Apply validation result
    if (!isValid) {
      field.classList.add('error');
      errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  validateForm() {
    const fields = elements.contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      utils.showMessage('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    const formData = new FormData(elements.contactForm);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    try {
      // Simulate API call
      await this.submitForm(data);
      
      utils.showMessage('¡Mensaje enviado con éxito! Te responderemos pronto.');
      elements.contactForm.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      utils.showMessage('Error al enviar el mensaje. Intenta nuevamente.', 'error');
    } finally {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  }

  async submitForm(data) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve(data);
        } else {
          reject(new Error('Network error'));
        }
      }, 1500);
    });
  }
}

// ===== NAVIGATION MANAGEMENT =====
class NavigationManager {
  constructor() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Filter buttons
    elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.setActiveFilter(filter);
        productManager.filterProducts(filter);
      });
    });

    // Mobile menu toggle
    if (elements.menuToggle) {
      elements.menuToggle.addEventListener('change', () => {
        this.toggleMobileMenu();
      });
    }

    // Scroll handling
    window.addEventListener('scroll', utils.debounce(() => this.handleScroll(), 10));
  }

  setActiveFilter(filter) {
    appState.currentFilter = filter;
    elements.filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  }

  toggleMobileMenu() {
    if (elements.menuToggle.checked) {
      elements.navbar.classList.add('show');
    } else {
      elements.navbar.classList.remove('show');
    }
  }

  handleScroll() {
    const menuContainer = document.querySelector('.menu-container');
    if (window.scrollY > 100) {
      menuContainer.classList.add('scrolled');
    } else {
      menuContainer.classList.remove('scrolled');
    }
  }
}

// ===== GLOBAL FUNCTIONS =====
function toggleCart() {
  const cartContainer = elements.cartContainer;
  const isVisible = cartContainer.classList.contains('show');
  
  if (isVisible) {
    cartContainer.classList.remove('show');
    cartContainer.setAttribute('aria-hidden', 'true');
  } else {
    cartContainer.classList.add('show');
    cartContainer.setAttribute('aria-hidden', 'false');
  }
}

function checkout() {
  cartManager.checkout();
}

function emptyCart() {
  cartManager.emptyCart();
}

// ===== INITIALIZATION =====
let productManager, cartManager, formManager, navigationManager;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize managers
  productManager = new ProductManager();
  cartManager = new CartManager();
  formManager = new FormManager();
  navigationManager = new NavigationManager();

  // Initial render
  productManager.renderProducts();
  cartManager.renderCart();

  // Add loading animation to page
  document.body.classList.add('loaded');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  utils.showMessage('Ocurrió un error inesperado', 'error');
});

// ===== PERFORMANCE OPTIMIZATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} 