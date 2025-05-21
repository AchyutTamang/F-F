// Cart functionality
function getCartItems() {
    // Get cart from localStorage
    const cartJson = localStorage.getItem('cart');
    console.log('Raw cart data from localStorage:', cartJson);
    return JSON.parse(cartJson || '[]');
}

function saveCartItems(cartItems) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('Saved cart to localStorage:', cartItems);
}

// Make these functions global
window.increaseQuantity = function(index) {
    console.log('Increasing quantity for index:', index);
    const cartItems = getCartItems();
    if (cartItems[index]) {
        cartItems[index].quantity += 1;
        saveCartItems(cartItems);
        // Reload the page after updating the cart
        window.location.reload();
    }
};

window.decreaseQuantity = function(index) {
    console.log('Decreasing quantity for index:', index);
    const cartItems = getCartItems();
    if (cartItems[index]) {
        cartItems[index].quantity -= 1;
        if (cartItems[index].quantity <= 0) {
            window.removeFromCart(index);
        } else {
            saveCartItems(cartItems);
            // Reload the page after updating the cart
            window.location.reload();
        }
    }
};

window.removeFromCart = function(index) {
    console.log('Removing item at index:', index);
    const cartItems = getCartItems();
    if (cartItems[index]) {
        cartItems.splice(index, 1);
        saveCartItems(cartItems);
        // Reload the page after updating the cart
        window.location.reload();
    }
};

function updateCartDisplay() {
    console.log('Updating cart display...');
    const cartItems = getCartItems();
    console.log('Cart items:', cartItems);
    
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const orderSummary = document.getElementById('order-summary');
    const cartCount = document.getElementById('cart-count');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    
    // Update cart count
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('Total items:', totalItems);
    
    if (cartCount) cartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
    
    // If we're not on the cart page, return after updating counts
    if (!cartItemsContainer) return;
    
    // If cart is empty, show empty message and hide order summary
    if (totalItems === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
        if (orderSummary) orderSummary.classList.add('hidden');
        
        // Make sure the empty cart message is inside the cart items container
        if (emptyCartMessage && !cartItemsContainer.contains(emptyCartMessage)) {
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(emptyCartMessage);
        }
        return;
    }
    
    // Otherwise, hide empty message and show order summary
    if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
    if (orderSummary) orderSummary.classList.remove('hidden');
    
    // Clear existing cart items
    cartItemsContainer.innerHTML = '';
    
    // Calculate subtotal
    let subtotal = 0;
    
    // Add each item to the cart display
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'py-4 flex justify-between items-center';
        itemElement.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                <div>
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-gray-600">Rs. ${item.price}</p>
                </div>
            </div>
            <div class="flex items-center">
                <div class="flex items-center mr-4">
                    <button type="button" class="decrease-btn bg-gray-200 px-2 py-1 rounded-l" data-index="${index}">-</button>
                    <span class="px-3 py-1 bg-gray-100">${item.quantity}</span>
                    <button type="button" class="increase-btn bg-gray-200 px-2 py-1 rounded-r" data-index="${index}">+</button>
                </div>
                <span class="font-medium mr-4">Rs. ${itemTotal}</span>
                <button type="button" class="remove-btn text-red-500 hover:text-red-700" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Update subtotal and total
    const deliveryCharge = 150; // Set delivery charge to Rs. 150
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `Rs. ${subtotal}`;
    if (totalElement) totalElement.textContent = `Rs. ${subtotal + deliveryCharge}`; // Adding delivery fee
}

function proceedToCheckout() {
    // Save cart data for the checkout page
    const cartItems = getCartItems();
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const checkoutData = {
        items: cartItems,
        subtotal: subtotal,
        deliveryCharge: 150,
        total: subtotal + 150
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing cart...');
    
    // Debug: Check what's in localStorage
    console.log('Current cart in localStorage:', localStorage.getItem('cart'));
    
    updateCartDisplay();
    
    // Add event listener to checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Add event delegation for cart buttons
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(event) {
            const target = event.target;
            
            // Check if the clicked element is a button or its child
            const button = target.closest('button');
            if (!button) return;
            
            const index = parseInt(button.getAttribute('data-index'));
            
            if (button.classList.contains('increase-btn')) {
                window.increaseQuantity(index);
            } else if (button.classList.contains('decrease-btn')) {
                window.decreaseQuantity(index);
            } else if (button.classList.contains('remove-btn')) {
                window.removeFromCart(index);
            }
        });
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize AOS animations if AOS is available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});
