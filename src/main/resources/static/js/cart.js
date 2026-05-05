document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    updateUserMenu(); // from app.js
    fetchCart();
    fetchAddresses();
});

let cartData = null;

async function fetchCart() {
    const container = document.getElementById('cartItemsContainer');
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        
        cartData = await response.json();
        renderCart();
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">Your cart is empty or an error occurred.</p>`;
        updateSummary(0);
    }
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: var(--bg-secondary); border-radius: 16px;">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h3>Your cart is empty</h3>
                <button class="primary-btn" style="margin-top: 1.5rem;" onclick="window.location.href='index.html#products'">Continue Shopping</button>
            </div>
        `;
        updateSummary(0);
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cartData.items.forEach(item => {
        total += item.price * item.quantity;
        const iconClass = item.imageUrl && item.imageUrl.startsWith('fa-') ? item.imageUrl : 'fa-box';
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-img">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div>
                    <h4>${item.productName}</h4>
                    <div style="color: var(--text-secondary); margin-top: 0.5rem;">$${item.price.toFixed(2)}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 2rem;">
                <div class="qty-control">
                    <span style="font-weight: 600;">Qty: ${item.quantity}</span>
                </div>
                <div style="font-weight: 700; font-size: 1.2rem;">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" onclick="removeItem(${item.productId})" title="Remove">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    updateSummary(total);
}

function updateSummary(total) {
    document.getElementById('summarySubtotal').innerText = `$${total.toFixed(2)}`;
    document.getElementById('summaryTotal').innerText = `$${total.toFixed(2)}`;
}

async function removeItem(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        if (!response.ok) throw new Error('Failed to remove item');
        
        cartData = await response.json();
        renderCart();
        showToast("Item removed from cart", "success");
    } catch (error) {
        console.error(error);
        showToast("Error removing item", "error");
    }
}

async function fetchAddresses() {
    try {
        const response = await fetch(`${API_BASE_URL}/addresses`, {
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        if (!response.ok) return; // Silent fail if no addresses
        
        const addresses = await response.json();
        const select = document.getElementById('addressSelect');
        
        addresses.forEach(addr => {
            const option = document.createElement('option');
            option.value = addr.id;
            option.text = `${addr.street}, ${addr.city}, ${addr.state}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

async function handleCheckout() {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        showToast("Your cart is empty", "warning");
        return;
    }

    const addressId = document.getElementById('addressSelect').value;
    if (!addressId) {
        showToast("Please select a shipping address", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentUser.token 
            },
            body: JSON.stringify({ addressId: parseInt(addressId) })
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Checkout failed');
        }
        
        showToast("Order placed successfully!", "success");
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        console.error(error);
        showToast(error.message, "error");
    }
}
