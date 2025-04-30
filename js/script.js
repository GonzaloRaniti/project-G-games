// Array de productos
const products = [
    { name: 'FIFA 25', price: 56000, image: 'image/fifa.avif', id: 1 },
    { name: 'PES 2025', price: 70000, image: 'image/pes.jpg', id: 2 },
    { name: 'CALL OF DUTTY', price: 80000, image: 'image/call-of-dutty.jpg', id: 3 },
    { name: 'FORMULA 1', price: 35000, image: 'image/formula-1.jpg', id: 4 },
    { name: 'GOD OF WAR', price: 15000, image: 'image/god-of-war.jpg', id: 5 },
    { name: 'MORTAL KOMBAT 11', price: 99000, image: 'image/mortal-kombat.jpg', id: 6 },
    { name: 'TOM CLANCY`S RAINBOW SIEGE', price: 12000, image: 'image/tom-clancy-rainbow-six.jpg', id: 7 },
    { name: 'RESIDENT EVIL 4 REMAKE', price: 49000, image: 'image/resident-evil.webp', id: 8 },
    { name: 'NBA 25', price: 99000, image: 'image/nba.jpg', id: 9 },
    { name: 'SPIDERMAN', price: 50000, image: 'image/spiderman.jpg', id: 10 },
    { name: 'GTA V', price: 66000, image: 'image/gta.jpg', id: 11 },
    { name: 'SILENT-HILL', price: 52000, image: 'image/silent-hill.jpg', id: 12 },
];

document.addEventListener('DOMContentLoaded', () => {
    const storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : [];

    renderProducts();
    renderCart();
});

const productList = document.getElementById('product-list');
const cartContainer = document.getElementById('cart-container');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

let cart = [];

// Renderizar productos en la tienda
function renderProducts() {
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toLocaleString()}</p>
            <button class="add-to-cart-btn">Agregar al carrito</button>
        `;
        
        productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.id));

        productList.appendChild(productCard);
    });
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const itemInCart = cart.find(item => item.id === productId);

    if (itemInCart) {
        itemInCart.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    mostrarMensajeAgregado(product.name); 
}

// Renderizar el carrito
function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Tu carrito está vacío.</p>';
        cartTotal.textContent = `Total: $0`;
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
            <div class="cart-item-details">
              <span class="cart-item-name">${item.name} x${item.quantity}</span>
              <span class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</span>
            </div>
            <div class="cart-item-actions">
              <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
              <button class="remove-btn" data-id="${item.id}" data-action="remove">X</button>
            </div>
            <hr>
          `;
            cartItems.appendChild(itemDiv);
        });

        cartTotal.textContent = `Total: $${total.toLocaleString()}`;
    }

    localStorage.setItem('cart', JSON.stringify(cart)); 
}

document.getElementById('cart-items').addEventListener('click', function (e) {
    const button = e.target.closest('button');
    if (!button) return;
  
    const id = button.dataset.id;
    const action = button.dataset.action;
  
    if (action === 'increase' || action === 'decrease') {
      changeQuantity(id, action);
    } else if (action === 'remove') {
      removeFromCart(id);
    }
  });

function changeQuantity(productId, action) {
    const id = Number(productId);
    const item = cart.find(item => item.id === id);
    if (item) {
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity--;
        }
    }
    renderCart();
}

function removeFromCart(productId) {
    const id = Number(productId);
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    renderCart();
}



function emptyCart() {
    cart = [];
    renderCart();
    toggleCart();
}


function toggleCart() {
    cartContainer.classList.toggle('show');
}




const contactForm = document.getElementById('contact-form');


contactForm.addEventListener('submit', function (event) {
  event.preventDefault();


  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;


  const formData = {
    name: name,
    email: email,
    message: message,
  };


  localStorage.setItem('contactFormData', JSON.stringify(formData));

  alert('¡Mensaje enviado!');

  contactForm.reset();
});


function mostrarOcultarMenu() {
    const menu = document.querySelector('#menu');

    if (menu.checked) {
        console.log('Mostrar Menú');
        
    } else {
        console.log('Ocultar Menú');
       
    }
}

document.querySelector('#menu').addEventListener('change', mostrarOcultarMenu);


function mostrarMensajeAgregado(nombreProducto) {
    const mensaje = document.createElement('div');
    mensaje.classList.add('mensaje-agregado');
    mensaje.innerText = `${nombreProducto} agregado al carrito`;

    document.body.appendChild(mensaje);

    setTimeout(() => {
        mensaje.remove();
    }, 3000);
}


