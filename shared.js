// ============================================================
//  ELITEX SHARED.JS — Firebase-First Data Layer
//  Firebase Project: elitex-fd3c0
//  Architecture: Firebase Realtime DB is the single source of truth.
//  localStorage is only a fast-read cache, kept in sync by Firebase listeners.
// ============================================================

// ==================== STATIC CAMPAIGN CATALOG ====================
const DEFAULT_CAMPAIGNS = [
    {
        id: "camp_necklace",
        brand: "EliteX Jewelry",
        title: "Silver Necklace Promo",
        productId: "prod_necklace",
        payout: "₹1.00 + Performance Bonus",
        deadline: "Active",
        category: "fashion",
        platform: "instagram",
        color: "#8b5cf6",
        avatarChar: "S",
        type: "buy_to_review"
    },
    {
        id: "camp_ring",
        brand: "EliteX Jewelry",
        title: "Gold Ring Aesthetic",
        productId: "prod_ring",
        payout: "₹1.00 + Performance Bonus",
        deadline: "Active",
        category: "fashion",
        platform: "instagram",
        color: "#f59e0b",
        avatarChar: "G",
        type: "buy_to_review"
    },
    {
        id: "camp_earrings",
        brand: "EliteX Jewelry",
        title: "Emerald Earrings Showcase",
        productId: "prod_earrings",
        payout: "₹1.00 + Performance Bonus",
        deadline: "Active",
        category: "fashion",
        platform: "tiktok",
        color: "#10b981",
        avatarChar: "E",
        type: "buy_to_review"
    },
    {
        id: "camp_bracelet",
        brand: "EliteX Jewelry",
        title: "Pearl Charm Aesthetics",
        productId: "prod_bracelet",
        payout: "₹1.00 + Performance Bonus",
        deadline: "Active",
        category: "fashion",
        platform: "youtube",
        color: "#6366f1",
        avatarChar: "P",
        type: "buy_to_review"
    },
    {
        id: "camp_direct",
        brand: "EliteX Jewelry",
        title: "Brand Transition Promo",
        payout: "₹1.00 + Performance Bonus",
        deadline: "Active",
        category: "fashion",
        platform: "tiktok",
        color: "#ef4444",
        avatarChar: "B",
        type: "direct_video"
    },
    {
        id: "camp_app",
        brand: "EliteX Partners",
        title: "EliteX App Store Review",
        payout: "₹1.00 + Performance Bonus",
        deadline: "Active",
        category: "app",
        platform: "youtube",
        color: "#3b82f6",
        avatarChar: "A",
        type: "app_review"
    },
    {
        id: "camp_onsite",
        brand: "EliteX Flagship",
        title: "NY Flagship Boutique Vlog",
        payout: "₹1.00 + Performance Bonus",
        deadline: "Active",
        category: "store",
        platform: "instagram",
        color: "#ec4899",
        avatarChar: "F",
        type: "onsite_video"
    }
];

const DEFAULT_PRODUCTS = [
    {
        "id": "prod_cenin_choker",
        "name": "Cenin Diamond Choker Necklace",
        "price": 1499,
        "cutPrice": 2499,
        "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
        "desc": "Exquisite sterling silver choker set with brilliant lab-grown diamond accents.",
        "category": "necklaces"
    },
    {
        "id": "prod_cenin_gold_ring",
        "name": "Cenin 18K Gold Solitaire Ring",
        "price": 2199,
        "cutPrice": 3299,
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
        "desc": "Minimalist 18K gold band featuring a sparkling solitaire stone.",
        "category": "rings"
    },
    {
        "id": "prod_cenin_emerald_earrings",
        "name": "Cenin Emerald Drop Earrings",
        "price": 1899,
        "cutPrice": 2799,
        "image": "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop",
        "desc": "Vibrant emerald drop earrings crafted in fine white gold settings.",
        "category": "earrings"
    },
    {
        "id": "prod_cenin_pearl_bracelet",
        "name": "Cenin Freshwater Pearl Bracelet",
        "price": 1299,
        "cutPrice": 1899,
        "image": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop",
        "desc": "Elegant freshwater pearls handcrafted with a signature gold clasp.",
        "category": "bracelets"
    },
    {
        "id": "prod_cenin_sapphire_chain",
        "name": "Cenin Sapphire Layered Chain",
        "price": 2899,
        "cutPrice": 3999,
        "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
        "desc": "Dual-layer gold chain featuring deep sapphire gemstone pendants.",
        "category": "necklaces"
    }
];

// ==================== FIREBASE CONFIG ====================
const ELITEX_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB_UYs4vVMKCxxxd3qP-nIf3l_yvJAgHGI",
  authDomain: "elitex-fd3c0.firebaseapp.com",
  databaseURL: "https://elitex-fd3c0-default-rtdb.firebaseio.com",
  projectId: "elitex-fd3c0",
  storageBucket: "elitex-fd3c0.firebasestorage.app",
  messagingSenderId: "542401584757",
  appId: "1:542401584757:web:01a7d4f85703790f74a23c"
};

// ==================== FIREBASE STATE ====================
window.firebaseDb = null;       // exposed on window so admin.html JS can check it
let _fbReady = false;           // true once Firebase listener is attached
let _pendingWrites = [];        // queued writes before Firebase is ready

// ==================== FIREBASE CONFIG HELPERS ====================
// Purge stale ceninasia config if still cached
(function _purgeLegacyConfig() {
    try {
        const raw = localStorage.getItem('elitex_firebase_config');
        if (raw && raw.includes('ceninasia')) {
            localStorage.removeItem('elitex_firebase_config');
            console.log('[EliteX] 🔄 Purged stale ceninasia Firebase config → using elitex-fd3c0');
        }
    } catch(e) {}
})();

// These return the configured Firebase credentials
function getFirebaseConfig() {
    const stored = localStorage.getItem('elitex_firebase_config');
    return stored ? JSON.parse(stored) : ELITEX_FIREBASE_CONFIG;
}
function saveFirebaseConfig(config) {
    localStorage.setItem('elitex_firebase_config', JSON.stringify(config));
}
function removeFirebaseConfig() {
    localStorage.removeItem('elitex_firebase_config');
}

// ==================== LOCAL CACHE HELPERS ====================
// Pages ALWAYS read from localStorage (cache). Firebase keeps it up to date in real-time.
function _cacheGet(key, fallback) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
}
function _cacheSet(key, value) {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
}

// ==================== INITIALIZE LOCAL CACHE ====================
function initializeDataStore() {
    if (localStorage.getItem('elitex_initialized') === null) {
        _cacheSet('elitex_balance', '5000.00');
        _cacheSet('elitex_orders', []);
        _cacheSet('elitex_submissions', []);
        _cacheSet('elitex_joined_campaigns', []);
        _cacheSet('elitex_activities', [
            { text: "Welcome to Elite X! ₹5,000.00 starter balance credited.", type: "emerald", time: "Just now" }
        ]);
        localStorage.setItem('elitex_initialized', 'true');
    }
    if (!localStorage.getItem('elitex_joined_campaigns')) {
        _cacheSet('elitex_joined_campaigns', []);
    }
}
initializeDataStore();

// ==================== FIREBASE SDK LOADER ====================
function loadFirebaseSDKs(callback) {
    if (window.firebase && window.firebase.database) { callback(); return; }

    const loadScript = (src, onload, onerror) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = onload;
        s.onerror = onerror;
        document.head.appendChild(s);
    };

    loadScript(
        'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
        () => loadScript(
            'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
            () => { console.log('[EliteX] Firebase SDKs loaded.'); callback(); },
            () => console.error('[EliteX] Failed to load Firebase Database SDK')
        ),
        () => console.error('[EliteX] Failed to load Firebase App SDK')
    );
}

// ==================== FIREBASE INIT & REAL-TIME LISTENER ====================
function initFirebase() {
    loadFirebaseSDKs(() => {
        try {
            const config = getFirebaseConfig();
            if (!firebase.apps.length) firebase.initializeApp(config);

            window.firebaseDb = firebase.database();
            _fbReady = true;

            console.log('[EliteX] 🔥 Firebase connected → elitex-fd3c0-default-rtdb');
            window.dispatchEvent(new Event('firebase_sync_active'));

            // ── REAL-TIME LISTENER: Firebase → localStorage cache → UI ──
            window.firebaseDb.ref('elitex_demo').on('value', snapshot => {
                const data = snapshot.val();

                if (!data) {
                    _pushToFirebase();
                    return;
                }

                let changed = false;
                const keys = {
                    balance:             { cache: 'elitex_balance',             fallback: '5000.00' },
                    security_amount:     { cache: 'elitex_security_amount',     fallback: '0.00' },
                    orders:              { cache: 'elitex_orders',              fallback: [] },
                    submissions:         { cache: 'elitex_submissions',         fallback: [] },
                    joined_campaigns:    { cache: 'elitex_joined_campaigns',    fallback: [] },
                    activities:          { cache: 'elitex_activities',          fallback: [] },
                    custom_transactions: { cache: 'elitex_custom_transactions', fallback: [] },
                    custom_products:     { cache: 'elitex_custom_products',     fallback: [] },
                    products:            { cache: 'elitex_custom_products',     fallback: [] }
                };

                Object.entries(keys).forEach(([fbKey, meta]) => {
                    if (data[fbKey] !== undefined) {
                        const incoming = typeof data[fbKey] === 'string'
                            ? data[fbKey]
                            : JSON.stringify(data[fbKey] || meta.fallback);
                        const current = localStorage.getItem(meta.cache) || '';
                        if (incoming !== current) {
                            localStorage.setItem(meta.cache, incoming);
                            changed = true;
                        }
                    }
                });

                if (changed) {
                    window.dispatchEvent(new CustomEvent('elitex_data_changed'));
                    window.dispatchEvent(new Event('elitex_balance_updated'));
                    window.dispatchEvent(new Event('elitex_activities_updated'));
                    window.dispatchEvent(new Event('storage'));
                }
            });

            // Flush pending writes
            _pendingWrites.forEach(fn => fn());
            _pendingWrites = [];

        } catch (e) {
            console.error('[EliteX] Firebase init failed:', e);
        }
    });
}

// ==================== WRITE TO FIREBASE ====================
// Called after every mutation. Reads current localStorage cache and pushes to Firebase.
function _pushToFirebase() {
    if (!window.firebaseDb) return;
    window.firebaseDb.ref('elitex_demo').set({
        balance:             localStorage.getItem('elitex_balance') || '5000.00',
        security_amount:     localStorage.getItem('elitex_security_amount') || '0.00',
        orders:              _cacheGet('elitex_orders', []),
        submissions:         _cacheGet('elitex_submissions', []),
        joined_campaigns:    _cacheGet('elitex_joined_campaigns', []),
        activities:          _cacheGet('elitex_activities', []),
        custom_transactions: _cacheGet('elitex_custom_transactions', []),
        custom_products:     _cacheGet('elitex_custom_products', [])
    }).then(() => {
        console.log('[EliteX] ✅ Data synced to Firebase.');
    }).catch(err => {
        console.error('[EliteX] ❌ Firebase write failed:', err);
    });
}

// Public alias — used everywhere after mutations
function triggerSync() {
    if (!window.firebaseDb) {
        // Queue it for when Firebase is ready
        _pendingWrites.push(_pushToFirebase);
        return;
    }
    _pushToFirebase();
}

// Auto-init Firebase on every page
initFirebase();

// ==================== DATA ACCESSOR FUNCTIONS ====================
// All reads are from localStorage (cache). Writes go to localStorage → triggerSync() → Firebase.

function getWalletBalance() {
    return parseFloat(localStorage.getItem('elitex_balance') || '5000.00');
}

function updateWalletBalance(delta) {
    const current = getWalletBalance();
    const newBal = Math.max(0, current + delta).toFixed(2);
    localStorage.setItem('elitex_balance', newBal);
    window.dispatchEvent(new Event('elitex_balance_updated'));
    // Don't triggerSync here — caller handles full sync after all mutations
    return parseFloat(newBal);
}

function getOrders() {
    return _cacheGet('elitex_orders', []);
}

function getAllProducts() {
    const custom = _cacheGet('elitex_custom_products', []);
    if (custom && custom.length > 0) {
        const customMapped = custom.filter(c => c && typeof c === 'object').map(c => {
            const nameStr = (c.name || 'Untitled Item').toString();
            const safeId  = c.id || ('prod_' + nameStr.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
            const pVal    = parseFloat(c.price || c.offerPrice || 0);
            return {
                id: safeId,
                name: nameStr,
                price: isNaN(pVal) ? 0 : pVal,
                image: c.image || c.img || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop",
                desc: c.desc || c.description || "Fine jewelry piece crafted with precision.",
                category: c.category || "jewelry",
                cutPrice: c.cutPrice || (pVal ? (pVal * 1.25).toFixed(2) : null)
            };
        });
        const defaultFiltered = DEFAULT_PRODUCTS.filter(p => !customMapped.some(m => m.id === p.id));
        return [...customMapped, ...defaultFiltered];
    }
    return DEFAULT_PRODUCTS;
}

function addProductToFirebase(product) {
    const newProd = {
        id: product.id || 'prod_' + Date.now(),
        name: product.name,
        price: parseFloat(product.price),
        cutPrice: parseFloat(product.cutPrice || (product.price * 1.25)),
        image: product.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop",
        desc: product.desc || "Fine jewelry piece crafted with precision.",
        category: product.category || "jewelry"
    };

    const currentCustom = _cacheGet('elitex_custom_products', []);
    // Avoid duplicates by ID
    const idx = currentCustom.findIndex(p => p.id === newProd.id);
    if (idx >= 0) {
        currentCustom[idx] = newProd;
    } else {
        currentCustom.unshift(newProd);
    }

    _cacheSet('elitex_custom_products', currentCustom);

    if (window.firebaseDb) {
        window.firebaseDb.ref('products/' + newProd.id).set(newProd);
        window.firebaseDb.ref('cenin_products/' + newProd.id).set(newProd);
        _pushToFirebase();
    }
    
    window.dispatchEvent(new CustomEvent('elitex_data_changed'));
    return newProd;
}

function placeOrder(productId) {
    const products = getAllProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, msg: "Product not found." };

    const balance = getWalletBalance();
    
    // Check if there is an associated buy-to-review campaign
    const campaign = DEFAULT_CAMPAIGNS.find(c => c.productId === productId);
    let deductSecurity = false;
    
    if (campaign) {
        const joined = getJoinedCampaigns();
        if (!joined.includes(campaign.id)) {
            deductSecurity = true;
        }
    }

    const totalNeeded = product.price + (deductSecurity ? 10.00 : 0);
    if (balance < totalNeeded) {
        return { 
            success: false, 
            msg: deductSecurity 
                ? `Insufficient balance. Product price (₹${product.price}) + ₹10.00 Security Deposit is required.` 
                : "Insufficient wallet balance." 
        };
    }

    const orders = getOrders();
    if (orders.find(o => o.productId === productId && o.status !== 'returned')) {
        return { success: false, msg: "You have already ordered this product." };
    }

    // Deduct price and optionally security
    updateWalletBalance(-product.price);

    // Record product order transaction
    addTransaction({
        ref: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        desc: `Ordered Jewelry: ${product.name}`,
        amount: -product.price,
        type: 'orders',
        typeName: 'Order Placed',
        avatarClass: 'debit',
        iconClass: 'ph-shopping-cart-simple',
        date: new Date().toLocaleDateString()
    });
    
    if (deductSecurity) {
        updateWalletBalance(-10.00);
        const joined = getJoinedCampaigns();
        joined.push(campaign.id);
        _cacheSet('elitex_joined_campaigns', joined);
        
        addTransaction({
            ref: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
            desc: `Security Deposit Frozen: ${campaign.brand}`,
            amount: -10.00,
            type: 'orders',
            typeName: 'Security Freeze',
            avatarClass: 'debit',
            iconClass: 'ph-lock-simple',
            date: new Date().toLocaleDateString()
        });
        addActivity(`Accepted task: Joined ${campaign.title} (₹10.00 Security Deposit Frozen)`, 'purple');
    }

    const newOrder = {
        orderId:   'ORD-' + Math.floor(100000 + Math.random() * 900000),
        productId: productId,
        name:      product.name,
        price:     product.price,
        status:    'ordered',
        date:      new Date().toLocaleDateString(),
        image:     product.image
    };

    orders.unshift(newOrder);
    _cacheSet('elitex_orders', orders);

    addActivity(`Ordered ${product.name} for ₹${product.price.toFixed(2)}`, 'indigo');
    triggerSync();
    return { success: true, order: newOrder };
}

function returnProduct(productId) {
    const orders = getOrders();
    // Allow cancellation if ordered (before video submission) or return if video_submitted
    const idx = orders.findIndex(o => o.productId === productId && (o.status === 'video_submitted' || o.status === 'ordered'));

    if (idx === -1) {
        return { success: false, msg: "No active order found for this product." };
    }

    const order = orders[idx];
    const oldStatus = order.status;
    order.status = 'returned';
    _cacheSet('elitex_orders', orders);

    updateWalletBalance(order.price);

    // Record refund transaction
    addTransaction({
        ref: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        desc: oldStatus === 'ordered' ? `Order Cancelled: ${order.name}` : `Product Returned: ${order.name}`,
        amount: order.price,
        type: 'income',
        typeName: 'Refund Received',
        avatarClass: 'credit',
        iconClass: 'ph-arrow-counter-clockwise',
        date: new Date().toLocaleDateString()
    });
    
    const activityText = oldStatus === 'ordered' 
        ? `Cancelled order for ${order.name} — ₹${order.price.toFixed(2)} refunded`
        : `Returned ${order.name} — ₹${order.price.toFixed(2)} refunded`;
        
    addActivity(activityText, 'emerald');
    triggerSync();
    return { success: true, msg: "Refunded successfully!" };
}

function getSubmissions() {
    return _cacheGet('elitex_submissions', []);
}

function addSubmission(campaignId, videoUrl) {
    const campaign = DEFAULT_CAMPAIGNS.find(c => c.id === campaignId);
    if (!campaign) return { success: false, msg: "Campaign target not found." };

    // Validation checks
    if (campaign.type === 'buy_to_review') {
        const orders = getOrders();
        const order = orders.find(o => o.productId === campaign.productId && o.status === 'ordered');
        if (!order) return { success: false, msg: "Order this jewelry product first before submitting a video." };
    } else {
        const joined = getJoinedCampaigns();
        if (!joined.includes(campaignId)) return { success: false, msg: "Join this campaign task first." };
    }

    const submissions = getSubmissions();
    const existing = submissions.find(s => s.campaignId === campaignId);

    if (existing) {
        if (existing.status !== 'rejected') {
            return { success: false, msg: "You already have a pending or approved submission." };
        }
        if (existing.resubmitCount && existing.resubmitCount >= 1) {
            return { success: false, msg: "Resubmission limit reached. You can only update the link once." };
        }
        
        existing.status = 'pending';
        existing.videoUrl = videoUrl;
        existing.resubmitCount = (existing.resubmitCount || 0) + 1;
        existing.date = new Date().toLocaleDateString();
        
        _cacheSet('elitex_submissions', submissions);
        addActivity(`Updated link for ${campaign.title} (1-time resubmission used)`, 'indigo');
        triggerSync();
        return { success: true, submission: existing };
    }

    const newSub = {
        subId:          'SUB-' + Math.floor(100000 + Math.random() * 900000),
        campaignId:     campaignId,
        campaignTitle:  campaign.title,
        campaignBrand:  campaign.brand,
        productId:      campaign.productId,
        videoUrl:       videoUrl,
        status:         'pending',
        date:           new Date().toLocaleDateString(),
        guaranteedPaid: false,
        performancePayout: 0,
        resubmitCount:  0
    };

    submissions.unshift(newSub);
    _cacheSet('elitex_submissions', submissions);

    addActivity(`Submitted link for ${campaign.title}`, 'indigo');
    triggerSync();
    return { success: true, submission: newSub };
}

function reviewSubmission(subId, status, bonus = 0) {
    const submissions = getSubmissions();
    const idx = submissions.findIndex(s => s.subId === subId);
    if (idx === -1) return { success: false, msg: "Submission not found." };

    const sub = submissions[idx];
    if (sub.status !== 'pending') return { success: false, msg: "This submission has already been reviewed." };

    sub.status = status;

    if (status === 'approved') {
        sub.guaranteedPaid    = true;
        sub.performancePayout = parseFloat(bonus);
        
        // Payout consists of: ₹1.00 token + bonus + ₹10.00 security refund
        const reward = 1.00 + parseFloat(bonus);
        const refundAmount = 10.00;
        const totalCredited = reward + refundAmount;

        updateWalletBalance(totalCredited);

        // Mark order as video_submitted so product can be returned
        const orders = getOrders();
        const order  = orders.find(o => o.productId === sub.productId && o.status === 'ordered');
        if (order) {
            order.status = 'video_submitted';
            _cacheSet('elitex_orders', orders);
        }

        // Add transaction entry
        addTransaction({
            ref: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
            desc: `Deposit Refunded + Reward: ${sub.campaignBrand || 'Campaign'}`,
            amount: totalCredited,
            type: 'income',
            typeName: 'Task Payout',
            avatarClass: 'credit',
            iconClass: 'ph-handshake',
            date: new Date().toLocaleDateString()
        });

        addActivity(
            `Video approved! ₹${totalCredited.toFixed(2)} credited (₹10.00 refund + ₹1.00 token + ₹${parseFloat(bonus).toFixed(2)} bonus)`,
            'emerald'
        );
    } else {
        addActivity(`Video link rejected for ${sub.campaignTitle}. Deposit remains frozen.`, 'rose');
    }

    _cacheSet('elitex_submissions', submissions);
    triggerSync();
    return { success: true };
}

function getJoinedCampaigns() {
    return _cacheGet('elitex_joined_campaigns', []);
}

function joinCampaign(campaignId) {
    const joined = getJoinedCampaigns();
    if (!joined.includes(campaignId)) {
        const campaign = DEFAULT_CAMPAIGNS.find(c => c.id === campaignId);
        if (!campaign) return { success: false, msg: "Campaign not found." };

        // Check if balance is enough for security deposit (₹10.00)
        const balance = getWalletBalance();
        if (balance < 10.00) {
            return { success: false, msg: "Insufficient balance for security deposit (₹10.00 required)." };
        }

        // Deduct 10.00 security deposit
        updateWalletBalance(-10.00);

        joined.push(campaignId);
        _cacheSet('elitex_joined_campaigns', joined);

        addActivity(`Accepted task: Joined ${campaign.title} (₹10.00 Security Deposit Frozen)`, 'purple');
        
        // Add transaction entry
        addTransaction({
            ref: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
            desc: `Security Deposit Frozen: ${campaign.brand}`,
            amount: -10.00,
            type: 'orders',
            typeName: 'Security Freeze',
            avatarClass: 'debit',
            iconClass: 'ph-lock-simple',
            date: new Date().toLocaleDateString()
        });

        triggerSync();
    }
    return { success: true };
}

function getActivityFeed() {
    return _cacheGet('elitex_activities', []);
}

function addActivity(text, type = 'indigo') {
    const feed = getActivityFeed();
    feed.unshift({ text, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    _cacheSet('elitex_activities', feed.slice(0, 30));
    window.dispatchEvent(new Event('elitex_activities_updated'));
    // Note: caller handles triggerSync() to batch writes
}

// ==================== RESET ====================
function resetDataStore() {
    localStorage.removeItem('elitex_initialized');
    initializeDataStore();
    triggerSync();
}

// ==================== UI HELPERS ====================

function syncHeaderBalance() {
    const el = document.getElementById('wallet-display-balance');
    if (el) el.textContent = `₹${getWalletBalance().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: 'ph-check-circle', error: 'ph-warning-circle', info: 'ph-info' };
    toast.innerHTML = `<i class="ph ${icons[type] || 'ph-info'}"></i><span>${message}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==================== NAVIGATION SETUP ====================

function renderHeaderAndSidebar(activeLink) {
    const bellMobile = document.getElementById('notificationBellMobile');
    if (bellMobile) bellMobile.addEventListener('click', () => showToast("No new notifications.", "info"));

    const openBtn  = document.getElementById('openMobileSidebar');
    const closeBtn = document.getElementById('closeMobileSidebar');
    const sidebar  = document.getElementById('sidebarMenu');
    const overlay  = document.getElementById('sidebarOverlay');

    if (openBtn && sidebar && overlay) {
        openBtn.addEventListener('click', () => { sidebar.classList.add('active'); overlay.classList.add('active'); });
        overlay.addEventListener('click', () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); });
        if (closeBtn) closeBtn.addEventListener('click', () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); });
    }

    document.querySelectorAll('.sidebar-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === activeLink);
    });
    document.querySelectorAll('.bottom-nav-item').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === activeLink);
    });

    // Mouse glow effect on cards
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        });
    });

    syncHeaderBalance();
    window.addEventListener('elitex_balance_updated', syncHeaderBalance);
    // Re-render page whenever Firebase pushes new data
    window.addEventListener('elitex_data_changed', syncHeaderBalance);
}

// ==================== SUBMISSION MODAL / DRAWER ====================

function setupSubmissionModal() {
    const openMobileDrawerBtn  = document.getElementById('openMobileDrawerBtn');
    const closeMobileDrawerBtn = document.getElementById('closeMobileDrawerBtn');
    const mobileDrawer         = document.getElementById('mobileDrawer');
    const mobileOverlay        = document.getElementById('mobileDrawerOverlay');

    function openDrawer() {
        if (mobileDrawer && mobileOverlay) {
            populateCampaignDropdown('campaignDropdownMobile', 'campaign-select-value-mobile', 'selected-campaign-name-mobile');
            mobileDrawer.classList.add('active');
            mobileOverlay.classList.add('active');
        }
    }
    function closeDrawer() {
        if (mobileDrawer && mobileOverlay) {
            mobileDrawer.classList.remove('active');
            mobileOverlay.classList.remove('active');
        }
    }

    if (openMobileDrawerBtn)  openMobileDrawerBtn.addEventListener('click', openDrawer);
    if (closeMobileDrawerBtn) closeMobileDrawerBtn.addEventListener('click', closeDrawer);
    if (mobileOverlay)        mobileOverlay.addEventListener('click', closeDrawer);

    // Handle ?submit=true URL param (deep-link from other pages)
    const params = new URLSearchParams(window.location.search);
    if (params.get('submit') === 'true') {
        const targetCampId = params.get('campaign');
        if (targetCampId) {
            const campaign  = DEFAULT_CAMPAIGNS.find(c => c.id === targetCampId);
            const hidden    = document.getElementById('campaign-select-value');
            const label     = document.getElementById('selected-campaign-name');
            if (campaign && hidden && label) {
                hidden.value       = targetCampId;
                label.textContent  = `${campaign.brand}: ${campaign.title}`;
            }
        }
        setTimeout(() => {
            const card = document.getElementById('submission-section');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth' });
                const inp = document.getElementById('video-link-input');
                if (inp) inp.focus();
            }
        }, 300);
    }
}

function populateCampaignDropdown(dropdownId, selectValueId, triggerLabelId) {
    const dropdown   = document.getElementById(dropdownId);
    if (!dropdown)   return;
    const trigger    = dropdown.querySelector('.dropdown-trigger');
    const menu       = dropdown.querySelector('.dropdown-menu');
    const hidden     = document.getElementById(selectValueId);
    const label      = document.getElementById(triggerLabelId);

    const orders            = getOrders();
    const orderedProductIds = orders.filter(o => o.status !== 'returned').map(o => o.productId);
    const joined            = getJoinedCampaigns();

    trigger.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.custom-dropdown').forEach(d => { if (d.id !== dropdownId) d.classList.remove('open'); });
        dropdown.classList.toggle('open');
    });

    const eligible = DEFAULT_CAMPAIGNS.filter(c =>
        c.type === 'buy_to_review' ? orderedProductIds.includes(c.productId) : joined.includes(c.id)
    );

    menu.innerHTML = '';
    if (eligible.length === 0) {
        menu.innerHTML = `<div style="padding:12px; font-size:0.78rem; color:var(--text-muted); text-align:center;">No accepted campaigns yet. Browse or order first!</div>`;
        return;
    }

    eligible.forEach(campaign => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.dataset.value = campaign.id;
        item.innerHTML = `<span class="item-brand">${campaign.brand}</span><span class="item-detail">${campaign.title}</span>`;
        item.addEventListener('click', e => {
            e.stopPropagation();
            hidden.value      = campaign.id;
            label.textContent = `${campaign.brand}: ${campaign.title}`;
            dropdown.classList.remove('open');
        });
        menu.appendChild(item);
    });
}

// Close dropdowns on outside click
document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
});
