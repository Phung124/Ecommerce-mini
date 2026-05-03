const API_BASE_URL = 'http://localhost:8081/api';

// --- UI State Management ---
let isLoginMode = true;
const currentUser = JSON.parse(localStorage.getItem('user')) || null;

// Mock Data for fallback
const mockProducts = [
    { id: 1, name: "Premium Wireless Headphones", price: 299.99, category: "Electronics", imageUrl: "fa-headphones" },
    { id: 2, name: "Minimalist Smartwatch", price: 199.50, category: "Accessories", imageUrl: "fa-clock" },
    { id: 3, name: "Mechanical Keyboard", price: 149.00, category: "Electronics", imageUrl: "fa-keyboard" },
    { id: 4, name: "Leather Studio Bag", price: 89.99, category: "Fashion", imageUrl: "fa-briefcase" },
    { id: 5, name: "4K Action Camera", price: 349.99, category: "Electronics", imageUrl: "fa-camera" },
    { id: 6, name: "Noise-Cancelling Earbuds", price: 129.99, category: "Accessories", imageUrl: "fa-ear-listen" },
];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    updateUserMenu();
    fetchProducts();
    
    // Setup Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            // Filter logic would go here
        });
    });
}

// --- Product Management ---

async function fetchProducts() {
    const grid = document.getElementById('productGrid');
    try {
        // Attempt to fetch from real backend
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Network or CORS error');
        
        const data = await response.json();
        const products = Array.isArray(data) && data.length > 0 ? data : mockProducts;
        renderProducts(products, grid);
    } catch (error) {
        console.warn('Backend not reachable or empty. Falling back to mock data.', error);
        renderProducts(mockProducts, grid);
    }
}

function renderProducts(products, container) {
    container.innerHTML = '';
    
    products.forEach(p => {
        const iconClass = p.imageUrl && p.imageUrl.startsWith('fa-') ? p.imageUrl : 'fa-box';
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrap">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="product-info">
                <span class="product-cate">${p.category || 'Category'}</span>
                <h4 class="product-title">${p.name}</h4>
                <div class="product-price">$${(p.price || 0).toFixed(2)}</div>
            </div>
            <button class="add-to-cart" onclick="addToCart(${p.id})">
                <i class="fas fa-plus"></i>
            </button>
        `;
        container.appendChild(card);
    });
}

function addToCart(productId) {
    if (!currentUser) {
        showToast("Please sign in to add items to cart", "warning");
        openLoginModal();
        return;
    }
    showToast("Product added to cart!", "success");
    // Update cart badge
    const badge = document.querySelector('.cart-badge');
    badge.innerText = parseInt(badge.innerText) + 1;
}

// --- Authentication UI & Logic ---

function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function toggleAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDesc');
    const btn = document.getElementById('authSubmitBtn');
    const prompt = document.getElementById('authPrompt');
    const link = document.getElementById('authToggleLink');
    const emailGroup = document.getElementById('emailGroup');
    const emailInput = document.getElementById('email');
    
    if (isLoginMode) {
        title.innerText = 'Welcome Back';
        desc.innerText = 'Sign in to your account to continue';
        btn.innerText = 'Sign In';
        prompt.innerText = "Don't have an account?";
        link.innerText = 'Sign Up';
        emailGroup.style.display = 'none';
        emailInput.removeAttribute('required');
    } else {
        title.innerText = 'Create Account';
        desc.innerText = 'Join our premium shopping experience';
        btn.innerText = 'Sign Up';
        prompt.innerText = "Already have an account?";
        link.innerText = 'Sign In';
        emailGroup.style.display = 'block';
        emailInput.setAttribute('required', 'true');
    }
}

async function handleAuth(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('authSubmitBtn');
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;
    
    try {
        if (isLoginMode) {
            // Call Signin API
            const response = await fetch(`${API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) throw new Error('Invalid credentials or CORS error');
            const data = await response.json();
            
            // Save info
            localStorage.setItem('user', JSON.stringify({ username, roles: data.roles, token: data.accessToken }));
            showToast(`Welcome back, ${username}!`, "success");
            
        } else {
            // Call Signup API
            const email = document.getElementById('email').value;
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role: ["user"] })
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Registration failed');
            }
            showToast("Registration successful! Please sign in.", "success");
            toggleAuthMode(new CustomEvent('click')); // Switch back to login
            btn.innerHTML = 'Sign In';
            btn.disabled = false;
            return; // Don't close modal or reload yet
        }
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    } catch (error) {
        console.error("Auth error:", error);
        // Fallback for demo if backend is not running/CORS issues
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.warn("Simulating login due to backend unavailability");
            localStorage.setItem('user', JSON.stringify({ username, token: "demo-token" }));
            showToast(`Demo Login successful, ${username}!`, "warning");
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast(error.message, "error");
        }
        btn.innerHTML = isLoginMode ? 'Sign In' : 'Sign Up';
        btn.disabled = false;
    }
}

function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (currentUser) {
        userMenu.innerHTML = `
            <div class="user-info-chip" onclick="handleLogout()">
                <i class="fas fa-user-circle"></i>
                <span>${currentUser.username}</span>
                <i class="fas fa-sign-out-alt" style="margin-left: 5px; color: var(--danger)" title="Logout"></i>
            </div>
        `;
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    showToast("Logged out successfully", "success");
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// --- Utilities ---

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
