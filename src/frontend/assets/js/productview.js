// Helper function to resolve asset paths for both port 3000 and 8000
function getAssetPath(relativePath) {
    const currentPath = window.location.pathname;
    
    // If we're on port 8000 serving from frontend directly
    if (window.location.port === '8000') {
        return relativePath;
    }
    
    // If we're on port 3000 or other port, adjust path
    // Assuming structure: localhost:3000/frontend/pages/...
    if (currentPath.includes('/frontend/pages/')) {
        return relativePath;
    }
    
    // If serving from different location, try to find frontend path
    if (currentPath.includes('/pages/')) {
        return relativePath;
    }
    
    // Default fallback
    return relativePath;
}

// Mock product data - Replace with API call later
const mockProduct = {
    id: 1,
    name: "Tissot PR100 Swiss Automatic Watch — Steel Blue Dial",
    category: "Watches",
    condition: "Like New",
    images: [
        getAssetPath("../assets/images/apple.png"),
        getAssetPath("../assets/images/alove.png"),
        getAssetPath("../assets/images/ashdaud.jpg"),
        getAssetPath("../assets/images/camera.png")
    ],
    currentBid: 1240,
    startingBid: 500,
    bidCount: 18,
    views: 1248,
    watching: 18,
    minNextBid: 1260,
    buyNowPrice: 1450,
    auctionEndTime: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
    
    seller: {
        name: "Marcus L.",
        badge: "Gold",
        avatar: "ML",
        sales: 312,
        rating: 4.9,
        reviews: 312,
        responseTime: "<1h",
        location: "New York, NY"
    },
    
    shipping: {
        ships: "nationwide",
        estimatedDays: "2-4 days"
    },
    
    specifications: {
        brand: "Tissot",
        year: 2022,
        accessories: "Box, Papers",
        caseDiameter: "40mm",
        caseMaterial: "Stainless Steel",
        movement: "Automatic ETA 2824-2",
        waterResistance: "100m",
        conditionRating: "Like New — 9.5/10"
    },
    
    description: "Gorgeous Tissot PR100 in immaculate condition. Purchased in 2022, worn only a handful of times for special occasions. The steel blue dial is stunning and the automatic movement keeps perfect time. Comes with original box, papers, and spare links. Crystal is scratch-free.",
    
    environmentalImpact: {
        co2Saved: "4.2kg",
        treesEquivalent: 0,
        ewastReduced: "1kg"
    },
    
    similarItems: [
        { id: 2, name: "Rolex Datejust 36mm", price: 5200, image: getAssetPath("../assets/images/apple.png") },
        { id: 3, name: "Omega Seamaster", price: 2800, image: getAssetPath("../assets/images/alove.png") },
        { id: 4, name: "Seiko Presage", price: 420, image: getAssetPath("../assets/images/ashdaud.jpg") }
    ]
};

// Get product ID from URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 1;
}

// Fetch product data (replace with actual API call)
async function fetchProduct(productId) {
    try {
        // Uncomment when backend is ready:
        // const response = await fetch(`/api/products/${productId}`);
        // return await response.json();
        
        // Using mock data for now
        return mockProduct;
    } catch (error) {
        console.error("Error fetching product:", error);
        return mockProduct;
    }
}

// Update DOM with product data
function displayProduct(product) {
    // Update breadcrumb
    document.querySelector('.breadcrumb').textContent = `Home › ${product.name.substring(0, 40)}...`;
    
    // Update main image
    document.querySelector('.main-image img').src = product.images[0];
    
    // Update thumbnails
    const thumbnailsContainer = document.querySelector('.thumbnails');
    thumbnailsContainer.innerHTML = product.images.map((img, idx) => `
        <img 
            class="${idx === 0 ? 'active-thumb' : ''}" 
            src="${img}" 
            alt="Product image ${idx + 1}"
            onclick="changeImage('${img}')"
        >
    `).join('');
    
    // Update environmental impact
    document.querySelector('.environment h2').textContent = product.environmentalImpact.co2Saved;
    document.querySelector('.environment-boxes').innerHTML = `
        <div>
            🌳 <strong>${product.environmentalImpact.treesEquivalent}</strong>
            <small>Trees equivalent</small>
        </div>
        <div>
            ♻️ <strong>${product.environmentalImpact.ewastReduced}</strong>
            <small>E-waste reduced</small>
        </div>
    `;
    
    // Update tags
    document.querySelector('.tags').innerHTML = `
        <span class="live">● Live</span>
        <span>${product.category}</span>
        <span>${product.condition}</span>
    `;
    
    // Update product title and info
    document.querySelector('h1').textContent = product.name;
    
    // Update views and watching
    document.querySelector('.views').textContent = `◉ ${product.views.toLocaleString()} views     ♧ ${product.watching} watching`;
    
    // Update current bid
    document.querySelector('.current-bid h2').textContent = `$${product.currentBid.toLocaleString()}`;
    document.querySelector('.current-bid p').innerHTML = `${product.bidCount} bids · Starting at $${product.startingBid.toLocaleString()}`;
    
    // Update seller info
    const sellerAvatar = document.querySelector('.seller-avatar');
    sellerAvatar.textContent = product.seller.avatar;
    
    const sellerName = document.querySelector('.seller-top h3');
    sellerName.innerHTML = `${product.seller.name} <span>● ${product.seller.badge}</span>`;
    
    const sellerStats = document.querySelector('.seller-stats');
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
    
    // Update location
    document.querySelector('.location').textContent = `⌖ ${product.seller.location} · Ships ${product.shipping.ships} · Estimated ${product.shipping.estimatedDays}`;
    
    // Update basic info
    document.querySelector('.basic-info').innerHTML = `
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
    
    // Update bid panel
    document.querySelector('.bid-panel h3 strong').textContent = `$${product.minNextBid.toLocaleString()}`;
    document.querySelector('.bid-panel input[type="number"]').value = product.minNextBid + 20;
    document.querySelector('.buy-now').textContent = `Buy Now — $${product.buyNowPrice.toLocaleString()}`;
    
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
    
    // Update description
    document.querySelector('.details-grid > div:first-child p').textContent = product.description;
    
    // Update similar items
    const similarContainer = document.querySelector('.similar-products');
    similarContainer.innerHTML = product.similarItems.map(item => `
        <div class="similar-card">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <strong>$${item.price.toLocaleString()}</strong>
        </div>
    `).join('');
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
