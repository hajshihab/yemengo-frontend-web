// تكوين الاتصال بالـ Backend
const API_BASE_URL = 'https://e5h6i7cvl38e.manus.space/api';

// Helper function to fetch data from API
async function fetchData(endpoint) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // إضافة CORS headers
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        hideLoading();
        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        hideLoading();
        // Display a user-friendly error message
        showError(`حدث خطأ أثناء تحميل البيانات من ${endpoint}. الرجاء المحاولة لاحقاً.`);
        return null;
    }
}

// Helper function to post data to API
async function postData(endpoint, data) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        hideLoading();
        return result;
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        hideLoading();
        showError(`حدث خطأ أثناء إرسال البيانات إلى ${endpoint}. الرجاء المحاولة لاحقاً.`);
        return null;
    }
}

// Show/Hide Loading Overlay
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('show');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
    }
}

// Show error message
function showError(message) {
    // يمكن تحسين هذا لاحقاً بإضافة نظام إشعارات أفضل
    alert(message);
}

// Populate Categories
async function populateCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    console.log('Loading categories...');
    const data = await fetchData('/categories');
    
    if (data && data.length > 0) {
        categoriesGrid.innerHTML = data.map(category => `
            <div class="category-card" onclick="filterByCategory(${category.id})">
                <div class="category-icon">${category.icon || '📦'}</div>
                <div class="card-content">
                    <h3>${category.name_ar}</h3>
                    <p>${category.description || ''}</p>
                    <small>${category.products_count || 0} منتج</small>
                </div>
            </div>
        `).join('');
        console.log(`Loaded ${data.length} categories`);
    } else {
        categoriesGrid.innerHTML = '<p class="no-data">لا توجد فئات متاحة حالياً.</p>';
        console.log('No categories found');
    }
}

// Populate Featured Products
async function populateFeaturedProducts() {
    const featuredProductsGrid = document.getElementById('featuredProductsGrid');
    if (!featuredProductsGrid) return;

    console.log('Loading featured products...');
    const data = await fetchData('/products/featured');
    
    if (data && data.length > 0) {
        featuredProductsGrid.innerHTML = data.map(product => `
            <div class="product-card" onclick="viewProduct(${product.id})">
                <img src="${product.main_image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(product.name)}" 
                     alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=منتج'">
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description ? product.description.substring(0, 100) + '...' : ''}</p>
                    <div class="price-section">
                        ${product.original_price ? `<span class="original-price">${product.original_price} ${product.currency}</span>` : ''}
                        <span class="price">${product.price} ${product.currency}</span>
                    </div>
                    <div class="product-meta">
                        <span class="store">🏪 ${product.store_name}</span>
                        <span class="stock">📦 ${product.stock_quantity} متوفر</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}); event.stopPropagation();">
                        إضافة للسلة
                    </button>
                </div>
            </div>
        `).join('');
        console.log(`Loaded ${data.length} featured products`);
    } else {
        featuredProductsGrid.innerHTML = '<p class="no-data">لا توجد منتجات مميزة حالياً.</p>';
        console.log('No featured products found');
    }
}

// Populate All Products
async function populateAllProducts(page = 1, categoryId = null, searchQuery = null) {
    const productsGrid = document.getElementById('allProductsGrid');
    if (!productsGrid) return;

    console.log('Loading all products...');
    let endpoint = `/products?page=${page}&per_page=20`;
    
    if (categoryId) {
        endpoint += `&category_id=${categoryId}`;
    }
    
    if (searchQuery) {
        endpoint += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const data = await fetchData(endpoint);
    
    if (data && data.products && data.products.length > 0) {
        productsGrid.innerHTML = data.products.map(product => `
            <div class="product-card" onclick="viewProduct(${product.id})">
                <img src="${product.main_image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(product.name)}" 
                     alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=منتج'">
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description ? product.description.substring(0, 100) + '...' : ''}</p>
                    <div class="price-section">
                        ${product.original_price ? `<span class="original-price">${product.original_price} ${product.currency}</span>` : ''}
                        <span class="price">${product.price} ${product.currency}</span>
                    </div>
                    <div class="product-meta">
                        <span class="category">📂 ${product.category_name}</span>
                        <span class="store">🏪 ${product.store_name}</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}); event.stopPropagation();">
                        إضافة للسلة
                    </button>
                </div>
            </div>
        `).join('');
        
        // إضافة pagination إذا لزم الأمر
        updatePagination(data.current_page, data.pages);
        console.log(`Loaded ${data.products.length} products (page ${data.current_page} of ${data.pages})`);
    } else {
        productsGrid.innerHTML = '<p class="no-data">لا توجد منتجات متاحة حالياً.</p>';
        console.log('No products found');
    }
}

// Populate Stats
async function populateStats() {
    const totalStoresElement = document.getElementById('totalStores');
    const totalProductsElement = document.getElementById('totalProducts');
    const totalCategoriesElement = document.getElementById('totalCategories');

    console.log('Loading stats...');
    const data = await fetchData('/stats');

    if (data) {
        if (totalStoresElement) totalStoresElement.textContent = data.total_stores || 0;
        if (totalProductsElement) totalProductsElement.textContent = data.total_products || 0;
        if (totalCategoriesElement) totalCategoriesElement.textContent = data.total_categories || 0;
        console.log('Stats loaded:', data);
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('input[placeholder*="ابحث"]');
    const searchButton = document.querySelector('button[onclick*="search"]');
    
    if (searchInput && searchButton) {
        searchButton.onclick = () => performSearch();
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('input[placeholder*="ابحث"]');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Searching for:', query);
            populateAllProducts(1, null, query);
        }
    }
}

// Filter by category
function filterByCategory(categoryId) {
    console.log('Filtering by category:', categoryId);
    populateAllProducts(1, categoryId);
}

// View product details
function viewProduct(productId) {
    console.log('Viewing product:', productId);
    // يمكن إضافة modal أو صفحة منفصلة لتفاصيل المنتج
    alert(`عرض تفاصيل المنتج رقم: ${productId}`);
}

// Add to cart
function addToCart(productId) {
    console.log('Adding to cart:', productId);
    // يمكن إضافة منطق سلة التسوق هنا
    alert(`تم إضافة المنتج رقم ${productId} إلى السلة!`);
}

// Update pagination
function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer || totalPages <= 1) return;

    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="populateAllProducts(${currentPage - 1})">السابق</button>`;
    }
    
    // Page numbers
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="${activeClass}" onclick="populateAllProducts(${i})">${i}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="populateAllProducts(${currentPage + 1})">التالي</button>`;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

// Test API connection
async function testConnection() {
    console.log('Testing API connection...');
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (response.ok) {
            console.log('✅ API connection successful');
            return true;
        } else {
            console.log('❌ API connection failed:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ API connection error:', error);
        return false;
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 YemenGo Frontend loaded');
    console.log('API Base URL:', API_BASE_URL);
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
        showError('لا يمكن الاتصال بالخادم. الرجاء المحاولة لاحقاً.');
        return;
    }
    
    // Setup search functionality
    setupSearch();
    
    // Load data
    populateCategories();
    populateFeaturedProducts();
    populateAllProducts();
    populateStats();
    
    console.log('✅ All data loaded successfully');
});

