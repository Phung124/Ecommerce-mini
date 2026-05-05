document.addEventListener('DOMContentLoaded', () => {
    // Role Protection
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    const roles = currentUser.roles || [];
    const isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
    if (!isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    updateUserMenu(); // from app.js
    
    // Initial load
    fetchAdminProducts();
});

// --- Tab Switching ---
function switchTab(tabName) {
    document.getElementById('tabProducts').classList.remove('active');
    document.getElementById('tabOrders').classList.remove('active');
    document.getElementById('panelProducts').style.display = 'none';
    document.getElementById('panelOrders').style.display = 'none';

    if (tabName === 'products') {
        document.getElementById('tabProducts').classList.add('active');
        document.getElementById('panelProducts').style.display = 'block';
        fetchAdminProducts();
    } else {
        document.getElementById('tabOrders').classList.add('active');
        document.getElementById('panelOrders').style.display = 'block';
        fetchAdminOrders();
    }
}

// --- Product Management ---

async function fetchAdminProducts() {
    const tbody = document.getElementById('adminProductTableBody');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;"><div class="loading-spinner"></div></td></tr>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/products?size=50`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        
        tbody.innerHTML = '';
        data.content.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${p.id}</td>
                <td><i class="fas ${p.imageUrl && p.imageUrl.startsWith('fa-') ? p.imageUrl : 'fa-box'}"></i></td>
                <td style="font-weight: 600;">${p.name}</td>
                <td>${p.category ? p.category.name : 'N/A'}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="openProductModal(${p.id}, '${p.name}', ${p.price}, ${p.stock}, '${p.description || ''}')" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="deleteProduct(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--danger);">Failed to load products</td></tr>';
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        if (!response.ok) throw new Error("Failed to delete");
        showToast("Product deleted successfully", "success");
        fetchAdminProducts();
    } catch (error) {
        showToast("Error deleting product", "error");
    }
}

function openProductModal(id = '', name = '', price = '', stock = '', desc = '') {
    document.getElementById('prodId').value = id;
    document.getElementById('prodName').value = name;
    document.getElementById('prodPrice').value = price;
    document.getElementById('prodStock').value = stock;
    document.getElementById('prodDesc').value = desc;
    
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

async function handleSaveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prodId').value;
    const reqBody = {
        name: document.getElementById('prodName').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        stock: parseInt(document.getElementById('prodStock').value),
        description: document.getElementById('prodDesc').value,
        imageUrl: "fa-gem", // Placeholder
        categoryId: 1 // Placeholder category
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentUser.token
            },
            body: JSON.stringify(reqBody)
        });
        if (!response.ok) throw new Error("Failed to save product");
        
        showToast("Product saved successfully!", "success");
        closeProductModal();
        fetchAdminProducts();
    } catch (error) {
        showToast("Error saving product", "error");
    }
}

// --- Order Management ---

async function fetchAdminOrders() {
    const tbody = document.getElementById('adminOrderTableBody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;"><div class="loading-spinner"></div></td></tr>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders?size=50`, {
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        
        tbody.innerHTML = '';
        data.content.forEach(o => {
            const date = new Date(o.createdAt).toLocaleString();
            let statusClass = o.status === 'PENDING' ? 'pending' : (o.status === 'COMPLETED' ? 'completed' : 'pending');
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${o.id}</td>
                <td>User ID: ${o.userId || 'N/A'}</td>
                <td>${date}</td>
                <td style="font-weight: 700;">$${o.totalAmount.toFixed(2)}</td>
                <td><span class="badge ${statusClass}">${o.status}</span></td>
                <td>
                    ${o.status === 'PENDING' ? `<button class="primary-btn" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;" onclick="completeOrder(${o.id})">Mark Completed</button>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--danger);">Failed to load orders</td></tr>';
    }
}

async function completeOrder(id) {
    if (!confirm('Mark this order as completed?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}/status?status=COMPLETED`, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + currentUser.token }
        });
        if (!response.ok) throw new Error("Failed to update status");
        
        showToast("Order status updated", "success");
        fetchAdminOrders();
    } catch (error) {
        showToast("Error updating order", "error");
    }
}
