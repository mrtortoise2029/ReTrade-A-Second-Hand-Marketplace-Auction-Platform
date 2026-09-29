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
    if (!window.ReTradeAPI) throw new Error('Backend service is unavailable.');
    const isAuctionPage = window.location.pathname.toLowerCase().endsWith('/productview.html');
    let record;
    if (isAuctionPage) {
        const auctions = await window.ReTradeAPI.get('auctions.php');
        const summary = auctions.find(item => item.slug === productId);
        if (!summary) throw new Error('Auction not found.');
        record = await window.ReTradeAPI.get('auctions.php?id=' + Number(summary.id));
    } else {
        record = await window.ReTradeAPI.get('products.php?slug=' + encodeURIComponent(productId));
    }
    const specs = record.specifications || {};
    const current = Number(record.current_price ?? record.price ?? 0);
    const increment = Number(record.bid_increment || 0);
    const initials = `${record.first_name?.[0] || ''}${record.last_name?.[0] || ''}` || 'S';
    const similar = await window.ReTradeAPI.get('products.php?category=' + encodeURIComponent(record.category_slug || ''));
    return {
        databaseId: Number(record.product_id || record.id), auctionId: record.current_price !== undefined ? Number(record.id) : null,
        id: record.slug, name: record.title, category: record.category, condition: record.condition_label,
        images: record.images || [], currentBid: current, startingBid: Number(record.starting_price ?? record.price ?? current),
        bidCount: Number(record.bid_count || 0), views: Number(record.views || 0), watching: 0,
        minNextBid: current + increment, buyNowPrice: Number(record.buy_now_price ?? record.price ?? 0),
        auctionEndTime: new Date(record.ends_at || Date.now()),
        seller: { name: `${record.first_name || ''} ${record.last_name || ''}`.trim(), badge: 'Verified', avatar: initials, sales: Number(record.seller_reviews || 0), rating: Number(record.seller_rating || 0), reviews: Number(record.seller_reviews || 0), responseTime: '—', location: record.location || 'Not provided' },
        shipping: { ships: 'nationwide', estimatedDays: record.shipping_days || 'Not provided' },
        specifications: { brand: record.brand || 'Not provided', year: record.year_purchased || 'Not provided', accessories: record.accessories || 'Not provided', caseDiameter: specs.caseDiameter || specs.screen || specs.size || 'Not provided', caseMaterial: specs.caseMaterial || specs.material || 'Not provided', movement: specs.movement || specs.processor || specs.focus || 'Not provided', waterResistance: specs.waterResistance || 'Not provided', conditionRating: record.condition_label },
        description: record.description, environmentalImpact: { co2Saved: `${Number(record.co2_saved_kg || 0)}kg`, treesEquivalent: Math.round(Number(record.co2_saved_kg || 0) / 2), ewastReduced: `${Math.max(.1, Number(record.co2_saved_kg || 0) / 4).toFixed(1)}kg` },
        similarItems: similar.filter(item => item.slug !== record.slug).slice(0, 3).map(item => ({ id: item.slug, name: item.title, price: Number(item.price || 0), image: item.images[0] || '', saleType: item.sale_type })), bids: record.bids || []
    };
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
    const fixedPriceHeading = document.querySelector('.fixed-price h2');
    const currentBidText = document.querySelector('.current-bid p');
    if (currentBidHeading) {
        currentBidHeading.textContent = `$${product.currentBid.toLocaleString()}`;
    }
    if (fixedPriceHeading) {
        fixedPriceHeading.textContent = `$${product.buyNowPrice.toLocaleString()}`;
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
    const fixedPrice = document.querySelector('.purchase-panel h3 strong');
    const buyNowButton = document.querySelector('.buy-now');
    if (bidPanelMin) {
        bidPanelMin.textContent = `$${product.minNextBid.toLocaleString()}`;
    }
    if (bidPanelInput) {
        bidPanelInput.value = product.minNextBid + 20;
    }
    if (fixedPrice) {
        fixedPrice.textContent = `$${product.buyNowPrice.toLocaleString()}`;
    }
    if (buyNowButton) {
        buyNowButton.textContent = `Buy Now — $${product.buyNowPrice.toLocaleString()}`;
    }
    
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
            <div class="similar-card" role="link" tabindex="0" data-product-id="${item.id}" data-sale-type="${item.saleType}">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <strong>$${item.price.toLocaleString()}</strong>
            </div>
        `).join('');
        similarContainer.querySelectorAll('.similar-card').forEach(card => {
            const open = () => {
                const page = card.dataset.saleType === 'auction' ? 'productView.html' : 'fixedproductview.html';
                window.location.href = `${page}?id=${encodeURIComponent(card.dataset.productId)}&source=${getSource()}`;
            };
            card.addEventListener('click', open);
            card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
        });
    }
    const bidHistory = document.querySelector('.bid-history');
    if (bidHistory && product.bids) {
        bidHistory.innerHTML = product.bids.map(bid => `<div class="bid-row"><div><span class="bid-user">${bid.bidder}</span><span class="bid-time">${new Date(bid.placed_at).toLocaleString()}</span></div><span class="bid-amount">$${Number(bid.amount).toLocaleString()}</span></div>`).join('');
    }
}

function changeImage(imageSrc) {
    document.querySelector('.main-image img').src = imageSrc;
    
    document.querySelectorAll('.thumbnails img').forEach(thumb => {
        thumb.classList.remove('active-thumb');
        if (thumb.src.includes(imageSrc.split('/').pop())) {
            thumb.classList.add('active-thumb');
        }
    });
}

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
    
    console.log(`Placing bid: $${bidAmount}`);
    alert(`Bid placed successfully! Your bid: $${bidAmount}`);
    
    document.querySelector('.current-bid h2').textContent = `$${parseInt(bidAmount).toLocaleString()}`;
    const newMinBid = parseInt(bidAmount) + 20;
    document.querySelector('.bid-panel h3 strong').textContent = `$${newMinBid.toLocaleString()}`;
    document.querySelector('.bid-panel input[type="number"]').value = newMinBid + 20;
}

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

document.addEventListener('DOMContentLoaded', initProductView);
