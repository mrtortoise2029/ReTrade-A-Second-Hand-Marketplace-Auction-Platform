// Helper function to resolve asset paths for both port 3000 and 8000
function getAssetPath(relativePath) {
    const currentPath = window.location.pathname;

    if (window.location.port === '8000') {
        return relativePath;
    }

    if (currentPath.includes('/frontend/pages/')) {
        return relativePath;
    }

    if (currentPath.includes('/pages/')) {
        return relativePath;
    }

    return relativePath;
}

const productCatalog = {
    'tissot-pr100': {
        id: 'tissot-pr100',
        name: 'Tissot PR100 Swiss Automatic Watch — Steel Blue Dial',
        category: 'Watches',
        condition: 'Like New',
        images: [
            'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80',
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=80',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80',
            'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80'
        ],
        currentBid: 1240,
        startingBid: 500,
        bidCount: 18,
        views: 1248,
        watching: 18,
        minNextBid: 1260,
        buyNowPrice: 1450,
        auctionEndTime: new Date(Date.now() + 2 * 60 * 1000),
        seller: {
            name: 'Marcus L.',
            badge: 'Gold',
            avatar: 'ML',
            sales: 312,
            rating: 4.9,
            reviews: 312,
            responseTime: '<1h',
            location: 'New York, NY'
        },
        shipping: { ships: 'nationwide', estimatedDays: '2-4 days' },
        specifications: {
            brand: 'Tissot',
            year: 2022,
            accessories: 'Box, Papers',
            caseDiameter: '40mm',
            caseMaterial: 'Stainless Steel',
            movement: 'Automatic ETA 2824-2',
            waterResistance: '100m',
            conditionRating: 'Like New — 9.5/10'
        },
        description: 'Gorgeous Tissot PR100 in immaculate condition. Purchased in 2022, worn only a handful of times for special occasions. The steel blue dial is stunning and the automatic movement keeps perfect time. Comes with original box, papers, and spare links. Crystal is scratch-free.',
        environmentalImpact: { co2Saved: '4.2kg', treesEquivalent: 0, ewastReduced: '1kg' },
        similarItems: [
            { id: 'rolex-datejust', name: 'Rolex Datejust 36mm', price: 5200, image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80' },
            { id: 'omega-seamaster', name: 'Omega Seamaster', price: 2800, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80' },
            { id: 'seiko-presage', name: 'Seiko Presage', price: 420, image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=600&q=80' }
        ]
    },
    'leica': {
        id: 'leica',
        name: 'Vintage Leica M6 Film Camera',
        category: 'Cameras',
        condition: 'Excellent',
        images: [
            'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80',
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&q=80',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80'
        ],
        currentBid: 1240,
        startingBid: 700,
        bidCount: 18,
        views: 1348,
        watching: 25,
        minNextBid: 1260,
        buyNowPrice: 1480,
        auctionEndTime: new Date(Date.now() + 2 * 60 * 1000),
        seller: { name: 'Olivia K.', badge: 'Gold', avatar: 'OK', sales: 211, rating: 5.0, reviews: 211, responseTime: '<2h', location: 'Chicago, IL' },
        shipping: { ships: 'nationwide', estimatedDays: '2-5 days' },
        specifications: { brand: 'Leica', year: 1989, accessories: 'Case, Lens', caseDiameter: '35mm', caseMaterial: 'Metal', movement: 'Manual Focus', waterResistance: 'Not specified', conditionRating: 'Excellent — 9.2/10' },
        description: 'Classic Leica M6 film camera in excellent condition. Includes original case, lens, strap, and operating manual. Fully tested and ready for collectors and street photographers.',
        environmentalImpact: { co2Saved: '3.4kg', treesEquivalent: 2, ewastReduced: '0.8kg' },
        similarItems: [
            { id: 'canon-ae-1', name: 'Canon AE-1', price: 680, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80' },
            { id: 'nikon-fm2', name: 'Nikon FM2', price: 740, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80' },
            { id: 'pentax-k100', name: 'Pentax K100', price: 620, image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&q=80' }
        ]
    },
    'apple-watch': {
        id: 'apple-watch',
        name: 'Apple Watch Ultra 2 Titanium',
        category: 'Wearables',
        condition: 'Excellent',
        images: [
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=80',
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80'
        ],
        currentBid: 680,
        startingBid: 420,
        bidCount: 31,
        views: 980,
        watching: 42,
        minNextBid: 700,
        buyNowPrice: 820,
        auctionEndTime: new Date(Date.now() + 2 * 60 * 1000),
        seller: { name: 'Mina R.', badge: 'Silver', avatar: 'MR', sales: 184, rating: 4.8, reviews: 184, responseTime: '<1h', location: 'Seattle, WA' },
        shipping: { ships: 'nationwide', estimatedDays: '1-3 days' },
        specifications: { brand: 'Apple', year: 2024, accessories: 'Band, Charger', caseDiameter: '49mm', caseMaterial: 'Titanium', movement: 'Smartwatch', waterResistance: '100m', conditionRating: 'Excellent — 9.4/10' },
        description: 'Apple Watch Ultra 2 Titanium in excellent condition. Includes the original braided band and charging cable. GPS, health monitoring, and trail-ready performance in one premium wearable.',
        environmentalImpact: { co2Saved: '2.6kg', treesEquivalent: 1, ewastReduced: '0.6kg' },
        similarItems: [
            { id: 'garmin-fenix', name: 'Garmin Fenix 7', price: 560, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80' },
            { id: 'samsung-watch', name: 'Samsung Watch', price: 430, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
            { id: 'fitbit-sense', name: 'Fitbit Sense', price: 290, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80' }
        ]
    },
    'bose': {
        id: 'bose',
        name: 'Bose QuietComfort 45 Bundle',
        category: 'Audio',
        condition: 'Like New',
        images: [
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80'
        ],
        currentBid: 195,
        startingBid: 140,
        bidCount: 9,
        views: 740,
        watching: 21,
        minNextBid: 205,
        buyNowPrice: 260,
        auctionEndTime: new Date(Date.now() + 2 * 60 * 1000),
        seller: { name: 'Ava C.', badge: 'Silver', avatar: 'AC', sales: 96, rating: 4.9, reviews: 96, responseTime: '<3h', location: 'Austin, TX' },
        shipping: { ships: 'nationwide', estimatedDays: '2-4 days' },
        specifications: { brand: 'Bose', year: 2023, accessories: 'Case, Cable', caseDiameter: 'N/A', caseMaterial: 'Fabric', movement: 'Wireless', waterResistance: 'Not specified', conditionRating: 'Like New — 9.7/10' },
        description: 'Bose QuietComfort 45 headphones in like-new condition with original case, charging cable, and travel pouch. Outstanding comfort and noise cancellation for work, travel, and everyday listening.',
        environmentalImpact: { co2Saved: '1.9kg', treesEquivalent: 1, ewastReduced: '0.4kg' },
        similarItems: [
            { id: 'sony-wh', name: 'Sony WH-1000XM5', price: 195, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80' },
            { id: 'airpods-max', name: 'AirPods Max', price: 345, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80' },
            { id: 'jbl-live', name: 'JBL Live 660NC', price: 170, image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=600&q=80' }
        ]
    },
    'sony-wh-1000xm5': {
        id: 'sony-wh-1000xm5',
        name: 'Sony WH-1000XM5 Noise Canceling Headphones',
        category: 'Audio',
        condition: 'Excellent',
        images: [
            'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80',
            'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=1200&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80'
        ],
        currentBid: 195,
        startingBid: 170,
        bidCount: 11,
        views: 880,
        watching: 19,
        minNextBid: 210,
        buyNowPrice: 250,
        auctionEndTime: new Date(Date.now() + 2 * 60 * 1000),
        seller: { name: 'Priya S.', badge: 'Gold', avatar: 'PS', sales: 289, rating: 4.9, reviews: 289, responseTime: '<1h', location: 'Boston, MA' },
        shipping: { ships: 'nationwide', estimatedDays: '2-4 days' },
        specifications: { brand: 'Sony', year: 2023, accessories: 'Case, Cable', caseDiameter: 'N/A', caseMaterial: 'Plastic', movement: 'Wireless', waterResistance: 'Not specified', conditionRating: 'Excellent — 9.5/10' },
        description: 'Sony WH-1000XM5 with outstanding active noise cancellation and exceptional sound clarity. Includes carrying case and charging cable in excellent condition.',
        environmentalImpact: { co2Saved: '2.2kg', treesEquivalent: 1, ewastReduced: '0.5kg' },
        similarItems: [
            { id: 'bose', name: 'Bose QuietComfort 45', price: 195, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80' },
            { id: 'apple-airpods-max', name: 'AirPods Max', price: 345, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80' },
            { id: 'jbl-live', name: 'JBL Live 660NC', price: 170, image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=600&q=80' }
        ]
    },
    'macbook-pro-m2': {
        id: 'macbook-pro-m2',
        name: 'MacBook Pro M2 16" — Space Gray',
        category: 'Laptops',
        condition: 'Good',
        images: [
            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=1200&q=80',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80'
        ],
        currentBid: 1650,
        startingBid: 1500,
        bidCount: 13,
        views: 1150,
        watching: 17,
        minNextBid: 1670,
        buyNowPrice: 1880,
        auctionEndTime: new Date(Date.now() + 2 * 60 * 1000),
        seller: { name: 'Tom K.', badge: 'Gold', avatar: 'TK', sales: 260, rating: 4.7, reviews: 260, responseTime: '<2h', location: 'San Jose, CA' },
        shipping: { ships: 'nationwide', estimatedDays: '3-5 days' },
        specifications: { brand: 'Apple', year: 2023, accessories: 'Charger, Sleeve', caseDiameter: '16"', caseMaterial: 'Aluminum', movement: 'M2 Chip', waterResistance: 'Not specified', conditionRating: 'Good — 8.8/10' },
        description: 'MacBook Pro M2 16-inch in space gray with excellent battery life and smooth performance. Includes charger and protective sleeve. Perfect for creators and professionals.',
        environmentalImpact: { co2Saved: '6.1kg', treesEquivalent: 3, ewastReduced: '1.3kg' },
        similarItems: [
            { id: 'macbook-air', name: 'MacBook Air M2', price: 1290, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
            { id: 'zenbook', name: 'ASUS ZenBook', price: 1190, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80' },
            { id: 'surface-laptop', name: 'Surface Laptop', price: 1180, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' }
        ]
    },
    'jordan-1': {
        id: 'jordan-1',
        name: 'Nike Air Jordan 1 Retro High OG',
        category: 'Footwear',
        condition: 'Like New',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80'
        ],
        currentBid: 240,
        startingBid: 200,
        bidCount: 17,
        views: 1240,
        watching: 11,
        minNextBid: 250,
        buyNowPrice: 290,
        auctionEndTime: new Date(Date.now() + 2 * 60 * 1000),
        seller: { name: 'Zara M.', badge: 'Gold', avatar: 'ZM', sales: 150, rating: 5.0, reviews: 150, responseTime: '<30m', location: 'Miami, FL' },
        shipping: { ships: 'nationwide', estimatedDays: '2-4 days' },
        specifications: { brand: 'Nike', year: 2024, accessories: 'Original Box', caseDiameter: 'US 9', caseMaterial: 'Leather', movement: 'Sneaker', waterResistance: 'Not specified', conditionRating: 'Like New — 9.8/10' },
        description: 'Jordan 1 Retro High OG in excellent, barely-worn condition. Original box included, no major scuffs, and fully cleaned and authenticated.',
        environmentalImpact: { co2Saved: '1.3kg', treesEquivalent: 0, ewastReduced: '0.3kg' },
        similarItems: [
            { id: 'yeezy-boost', name: 'Yeezy Boost 350', price: 210, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
            { id: 'nike-dunk', name: 'Nike Dunk Low', price: 180, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80' },
            { id: 'adidas-samba', name: 'Adidas Samba', price: 170, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80' }
        ]
    }
};

function getSource() {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    return source === 'landingwithlogin' ? 'landingwithlogin' : 'landing';
}

function getProductId() {
    const params = new URLSearchParams(window.location.search);
    const productKey = params.get('id') || params.get('product') || 'tissot-pr100';
    return String(productKey).trim().toLowerCase();
}

async function fetchProduct(productId) {
    try {
        if (!productId || !productCatalog[productId]) {
            return productCatalog['tissot-pr100'];
        }
        return productCatalog[productId];
    } catch (error) {
        console.error('Error fetching product:', error);
        return productCatalog['tissot-pr100'];
    }
}

function applySourceNavigation() {
    const source = getSource();
    const homePath = source === 'landingwithlogin' ? 'landingwithlogin.html' : 'landing.html';

    const homeLink = document.querySelector('.nav-item[href="landingwithlogin.html"], .nav-item[href="landing.html"]');
    if (homeLink) {
        homeLink.setAttribute('href', homePath);
        homeLink.classList.add('active');
    }

    const logoutLink = document.querySelector('.dropdown-content .logout');
    if (logoutLink) {
        logoutLink.setAttribute('href', homePath);
    }
}

// Update DOM with product data
function displayProduct(product) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = `Home › ${product.name.substring(0, 40)}...`;
    }

    const mainImage = document.querySelector('.main-image img');
    if (mainImage) {
        mainImage.src = product.images[0];
    }
    
    const thumbnailsContainer = document.querySelector('.thumbnails');
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = product.images.map((img, idx) => `
            <img 
                class="${idx === 0 ? 'active-thumb' : ''}" 
                src="${img}" 
                alt="Product image ${idx + 1}"
                onclick="changeImage('${img}')"
            >
        `).join('');
    }

    const environmentHeading = document.querySelector('.environment h2');
    const environmentBoxes = document.querySelector('.environment-boxes');
    if (environmentHeading) {
        environmentHeading.textContent = product.environmentalImpact.co2Saved;
    }
    if (environmentBoxes) {
        environmentBoxes.innerHTML = `
            <div>
                🌳 <strong>${product.environmentalImpact.treesEquivalent}</strong>
                <small>Trees equivalent</small>
            </div>
            <div>
                ♻️ <strong>${product.environmentalImpact.ewastReduced}</strong>
                <small>E-waste reduced</small>
            </div>
        `;
    }
    
    const tags = document.querySelector('.tags');
    if (tags) {
        tags.innerHTML = `
            <span class="live">● Live</span>
            <span>${product.category}</span>
            <span>${product.condition}</span>
        `;
    }

    const productHeading = document.querySelector('h1');
    if (productHeading) {
        productHeading.textContent = product.name;
    }

    const viewsEl = document.querySelector('.views');
    if (viewsEl) {
        viewsEl.textContent = `◉ ${product.views.toLocaleString()} views     ♧ ${product.watching} watching`;
    }

    const currentBidHeading = document.querySelector('.current-bid h2');
    const currentBidText = document.querySelector('.current-bid p');
    if (currentBidHeading) {
        currentBidHeading.textContent = `$${product.currentBid.toLocaleString()}`;
    }
    if (currentBidText) {
        currentBidText.innerHTML = `${product.bidCount} bids · Starting at $${product.startingBid.toLocaleString()}`;
    }
    
    const sellerAvatar = document.querySelector('.seller-avatar');
    if (sellerAvatar) {
        sellerAvatar.textContent = product.seller.avatar;
    }

    const sellerName = document.querySelector('.seller-top h3');
    if (sellerName) {
        sellerName.innerHTML = `${product.seller.name} <span>● ${product.seller.badge}</span>`;
    }

    const sellerStats = document.querySelector('.seller-stats');
    if (sellerStats) {
        sellerStats.innerHTML = `
            <div>
                <strong>${product.seller.sales}</strong>
                <small>Sales</small>
            </div>
            <div>
                <strong>${product.seller.responseTime}</strong>
                <small>Response</small>
            </div>
            <div>
                <strong>${product.seller.rating}★</strong>
                <small>Rating</small>
            </div>
        `;
    }

    const locationEl = document.querySelector('.location');
    if (locationEl) {
        locationEl.textContent = `⌖ ${product.seller.location} · Ships ${product.shipping.ships} · Estimated ${product.shipping.estimatedDays}`;
    }

    const basicInfo = document.querySelector('.basic-info');
    if (basicInfo) {
        basicInfo.innerHTML = `
            <div>
                <span>Condition</span>
                <strong>${product.condition}</strong>
            </div>
            <div>
                <span>Brand</span>
                <strong>${product.specifications.brand}</strong>
            </div>
            <div>
                <span>Year</span>
                <strong>${product.specifications.year}</strong>
            </div>
            <div>
                <span>Accessories</span>
                <strong>${product.specifications.accessories}</strong>
            </div>
        `;
    }

    const bidPanelMin = document.querySelector('.bid-panel h3 strong');
    const bidPanelInput = document.querySelector('.bid-panel input[type="number"]');
    const buyNowButton = document.querySelector('.buy-now');
    if (bidPanelMin) {
        bidPanelMin.textContent = `$${product.minNextBid.toLocaleString()}`;
    }
    if (bidPanelInput) {
        bidPanelInput.value = product.minNextBid + 20;
    }
    if (buyNowButton) {
        buyNowButton.textContent = `Buy Now — $${product.buyNowPrice.toLocaleString()}`;
    }
    
    // Update specifications
    const specRows = document.querySelectorAll('.spec-row');
    if (specRows.length >= 6) {
        specRows[0].innerHTML = `<span>Case Diameter</span><strong>${product.specifications.caseDiameter}</strong>`;
        specRows[1].innerHTML = `<span>Case Material</span><strong>${product.specifications.caseMaterial}</strong>`;
        specRows[2].innerHTML = `<span>Movement</span><strong>${product.specifications.movement}</strong>`;
        specRows[3].innerHTML = `<span>Water Resistance</span><strong>${product.specifications.waterResistance}</strong>`;
        specRows[4].innerHTML = `<span>Condition</span><strong>${product.specifications.conditionRating}</strong>`;
        specRows[5].innerHTML = `<span>Year Purchased</span><strong>${product.specifications.year}</strong>`;
    }
    
    const descriptionEl = document.querySelector('.details-grid > div:first-child p');
    if (descriptionEl) {
        descriptionEl.textContent = product.description;
    }

    const similarContainer = document.querySelector('.similar-products');
    if (similarContainer) {
        similarContainer.innerHTML = product.similarItems.map(item => `
            <div class="similar-card">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <strong>$${item.price.toLocaleString()}</strong>
            </div>
        `).join('');
    }
}

// Change main image
function changeImage(imageSrc) {
    document.querySelector('.main-image img').src = imageSrc;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnails img').forEach(thumb => {
        thumb.classList.remove('active-thumb');
        if (thumb.src.includes(imageSrc.split('/').pop())) {
            thumb.classList.add('active-thumb');
        }
    });
}

// Place bid
function placeBid() {
    const role = localStorage.getItem('userRole');
    if (role !== 'user' && role !== 'admin') {
        alert('Please log in first to place a bid.');
        window.location.href = 'login.html';
        return;
    }

    const bidAmount = document.querySelector('.bid-panel input[type="number"]').value;
    const minBid = parseInt(document.querySelector('.bid-panel h3 strong').textContent.replace(/[$,]/g, ''));
    
    if (!bidAmount) {
        alert("Please enter a bid amount");
        return;
    }
    
    if (parseInt(bidAmount) < minBid) {
        alert(`Bid must be at least $${minBid}`);
        return;
    }
    
    // TODO: Send bid to backend API
    console.log(`Placing bid: $${bidAmount}`);
    alert(`Bid placed successfully! Your bid: $${bidAmount}`);
    
    // Update UI
    document.querySelector('.current-bid h2').textContent = `$${parseInt(bidAmount).toLocaleString()}`;
    const newMinBid = parseInt(bidAmount) + 20;
    document.querySelector('.bid-panel h3 strong').textContent = `$${newMinBid.toLocaleString()}`;
    document.querySelector('.bid-panel input[type="number"]').value = newMinBid + 20;
}

// Auction timer
function updateAuctionTimer(endTime) {
    const timerElement = document.querySelector('.timer');
    
    function calculateTimeLeft() {
        const now = new Date().getTime();
        const distance = endTime.getTime() - now;
        
        if (distance < 0) {
            timerElement.parentElement.innerHTML = '<p style="color: red; font-weight: bold;">Auction Ended</p>';
            return;
        }
        
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        timerElement.innerHTML = `
            <div>
                ${String(minutes).padStart(2, '0')}
                <small>M</small>
            </div>
            <div>
                ${String(seconds).padStart(2, '0')}
                <small>S</small>
            </div>
        `;
    }
    
    calculateTimeLeft();
    setInterval(calculateTimeLeft, 1000);
}

// Initialize page
async function initProductView() {
    try {
        applySourceNavigation();
        const productId = getProductId();
        const product = await fetchProduct(productId);

        displayProduct(product);
        updateAuctionTimer(product.auctionEndTime);

        console.log("Product view loaded:", product);
    } catch (error) {
        console.error("Error initializing product view:", error);
    }
}

// Load when DOM is ready
document.addEventListener('DOMContentLoaded', initProductView);
