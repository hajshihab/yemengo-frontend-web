const API_BASE_URL = '/api';

// Helper function to fetch data from API
async function fetchData(endpoint) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
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
        alert(`حدث خطأ أثناء تحميل البيانات من ${endpoint}. الرجاء المحاولة لاحقاً.`);
        return null;
    }
}

// Show/Hide Loading Overlay
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

// Populate Categories
async function populateCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    const data = await fetchData('/categories');
    if (data && data.length > 0) {
        categoriesGrid.innerHTML = data.map(category => `
            <div class="category-card">
                <img src="${category.icon || 'https://via.placeholder.com/150?text=Category'}" alt="${category.name_ar}">
                <div class="card-content">
                    <h3>${category.name_ar}</h3>
                </div>
            </div>
        `).join('');
    } else {
        categoriesGrid.innerHTML = '<p>لا توجد فئات متاحة حالياً.</p>';
    }
}

// Populate Auctions
async function populateAuctions() {
    const auctionsGrid = document.getElementById('auctionsGrid');
    if (!auctionsGrid) return;

    const data = await fetchData('/auctions/active');
    if (data && data.length > 0) {
        auctionsGrid.innerHTML = data.map(auction => `
            <div class="auction-card">
                <img src="${auction.main_image || 'https://via.placeholder.com/300x200?text=Auction'}" alt="${auction.title}">
                <div class="card-content">
                    <h3>${auction.title}</h3>
                    <p class="current-bid">المزايدة الحالية: ${auction.current_price} ${auction.currency}</p>
                    <p class="time-left">ينتهي في: ${formatTimeRemaining(auction.time_remaining)}</p>
                </div>
            </div>
        `).join('');
    } else {
        auctionsGrid.innerHTML = '<p>لا توجد مزادات نشطة حالياً.</p>';
    }
}

// Populate Featured Products
async function populateFeaturedProducts() {
    const featuredProductsGrid = document.getElementById('featuredProductsGrid');
    if (!featuredProductsGrid) return;

    const data = await fetchData('/products/featured');
    if (data && data.length > 0) {
        featuredProductsGrid.innerHTML = data.map(product => `
            <div class="product-card">
                <img src="${product.main_image || 'https://via.placeholder.com/300x200?text=Product'}" alt="${product.name}">
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price} ${product.currency}</p>
                </div>
            </div>
        `).join('');
    } else {
        featuredProductsGrid.innerHTML = '<p>لا توجد منتجات مميزة حالياً.</p>';
    }
}

// Populate Stats
async function populateStats() {
    const totalStoresElement = document.getElementById('totalStores');
    const totalProductsElement = document.getElementById('totalProducts');
    const totalAuctionsElement = document.getElementById('totalAuctions');

    if (!totalStoresElement || !totalProductsElement || !totalAuctionsElement) return;

    const data = await fetchData('/products/stats');
    const auctionStats = await fetchData('/auctions/stats');

    if (data) {
        totalStoresElement.textContent = data.total_stores;
        totalProductsElement.textContent = data.total_products;
    }
    if (auctionStats) {
        totalAuctionsElement.textContent = auctionStats.active_auctions;
    }
}

// Helper for time remaining (for auctions)
function formatTimeRemaining(time) {
    if (!time) return 'انتهى';
    const { days, hours, minutes, seconds } = time;
    if (days > 0) return `${days} يوم و ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة و ${minutes} دقيقة`;
    if (minutes > 0) return `${minutes} دقيقة و ${seconds} ثانية`;
    return `${seconds} ثانية`;
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    populateAuctions();
    populateFeaturedProducts();
    populateStats();
});


