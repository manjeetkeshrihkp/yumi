// ============================================================
//  ELITEX SHARED.JS — Firebase-First Data Layer
//  Firebase Project: elitex-fd3c0
//  Architecture: Firebase Realtime DB is the single source of truth.
//  localStorage is only a fast-read cache, kept in sync by Firebase listeners.
// ============================================================

// ==================== STATIC CAMPAIGN CATALOG ====================
const STATIC_CAMPAIGNS = [
    {
        id: "camp_necklace",
        brand: "EliteX Jewelry",
        title: "Silver Necklace Promo",
        productId: "prod_cenin_choker",
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
        productId: "prod_cenin_gold_ring",
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
        productId: "prod_cenin_emerald_earrings",
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
        productId: "prod_cenin_pearl_bracelet",
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

let DEFAULT_CAMPAIGNS = [...STATIC_CAMPAIGNS];

function syncLiveCampaigns() {
    try {
        const customCampaigns = JSON.parse(localStorage.getItem('elitex_custom_campaigns') || '[]');
        if (customCampaigns) {
            const filteredStatic = STATIC_CAMPAIGNS.filter(sc => !customCampaigns.some(cc => cc.id === sc.id));
            DEFAULT_CAMPAIGNS = [...customCampaigns, ...filteredStatic];
        }
    } catch(e) {
        console.error("Error syncing campaigns:", e);
    }
}
syncLiveCampaigns();

window.addEventListener('storage', (e) => {
    if (e.key === 'elitex_custom_campaigns') {
        syncLiveCampaigns();
    }
});
window.addEventListener('elitex_data_changed', () => {
    syncLiveCampaigns();
});

function addCampaignToFirebase(campaign) {
    const newCamp = {
        id: campaign.id || 'camp_' + Date.now(),
        brand: campaign.brand || 'EliteX Brand',
        title: campaign.title,
        productId: campaign.productId || '',
        payout: campaign.payout || '₹1.00 + Performance Bonus',
        deadline: campaign.deadline || 'Active',
        category: campaign.category || 'fashion',
        platform: campaign.platform || 'instagram',
        color: campaign.color || '#6366f1',
        avatarChar: campaign.avatarChar || (campaign.brand ? campaign.brand[0].toUpperCase() : 'C'),
        type: campaign.type || 'direct_video'
    };

    const currentCustom = JSON.parse(localStorage.getItem('elitex_custom_campaigns') || '[]');
    currentCustom.unshift(newCamp);
    localStorage.setItem('elitex_custom_campaigns', JSON.stringify(currentCustom));
    
    // Update the live DEFAULT_CAMPAIGNS array immediately so all active pages benefit
    DEFAULT_CAMPAIGNS.unshift(newCamp);

    if (window.firebaseDb) {
        window.firebaseDb.ref('campaigns/' + newCamp.id).set(newCamp);
        _pushToFirebase();
    }
    
    window.dispatchEvent(new CustomEvent('elitex_data_changed'));
    return newCamp;
}

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
    if (window.firebase && window.firebase.database && window.firebase.auth) { callback(); return; }

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
            () => loadScript(
                'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
                () => { console.log('[EliteX] Firebase SDKs (App, DB, Auth) loaded.'); callback(); },
                () => console.error('[EliteX] Failed to load Firebase Auth SDK')
            ),
            () => console.error('[EliteX] Failed to load Firebase Database SDK')
        ),
        () => console.error('[EliteX] Failed to load Firebase App SDK')
    );
}

function updateDOMProfile(user) {
    if (!user) return;
    const name = user.displayName || user.email || 'Creator';
    const photo = user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';
    
    // Replace hardcoded name text "Alex Carter" in headings or divs
    document.querySelectorAll('h4').forEach(el => {
        if (el.textContent.trim() === 'Alex Carter') {
            el.textContent = name;
        }
    });
    // Replace names in card-val
    document.querySelectorAll('.card-val').forEach(el => {
        if (el.textContent.trim() === 'Alex Carter') {
            el.textContent = name;
        }
    });
    // Replace avatar images
    document.querySelectorAll('.profile-avatar img, .user-profile img').forEach(img => {
        img.src = photo;
    });

    const drawer = document.getElementById('profileDrawer');
    if (drawer && !document.getElementById('elitex-signout-btn')) {
        const btn = document.createElement('button');
        btn.id = 'elitex-signout-btn';
        btn.style.width = '100%';
        btn.style.marginTop = '14px';
        btn.style.padding = '12px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '0.85rem';
        btn.style.fontWeight = '700';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.gap = '8px';
        btn.style.background = 'rgba(239, 68, 68, 0.08)';
        btn.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        btn.style.color = '#f87171';
        btn.innerHTML = '<i class="ph ph-sign-out"></i> Sign Out';
        btn.onclick = () => {
            firebase.auth().signOut().then(() => {
                window.location.href = 'sign.html';
            });
        };
        
        // Append right below the sync analytics button
        const contentDiv = drawer.querySelector('div[style*="text-align: center"]');
        if (contentDiv) {
            contentDiv.appendChild(btn);
        } else {
            drawer.appendChild(btn);
        }
    }
}

function showAuthOverlay() {
    if (document.getElementById('elitex-auth-overlay')) return;

    // Create the overlay container
    const overlay = document.createElement('div');
    overlay.id = 'elitex-auth-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(9, 10, 15, 0.85)';
    overlay.style.backdropFilter = 'blur(20px)';
    overlay.style.zIndex = '99999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.animation = 'fadeIn 0.3s ease';

    // Inject styles for fade in and modal animation
    if (!document.getElementById('elitex-auth-styles')) {
        const style = document.createElement('style');
        style.id = 'elitex-auth-styles';
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .auth-popup-card {
                background: rgba(20, 24, 38, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                padding: 40px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                backdrop-filter: blur(12px);
                animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            @keyframes scaleUp {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .auth-popup-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                background: #ffffff;
                color: #090a0f;
                border: none;
                padding: 14px 24px;
                border-radius: 8px;
                font-weight: 700;
                cursor: pointer;
                width: 100%;
                margin-top: 24px;
                font-size: 0.9rem;
                transition: all 0.2s ease;
            }
            .auth-popup-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 255, 255, 0.15);
            }
            .auth-popup-btn:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // Modal contents
    overlay.innerHTML = `
        <div class="auth-popup-card">
            <div style="font-size: 2.2rem; font-weight: 900; letter-spacing: 4px; background: linear-gradient(135deg, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px;">
                ELITE<span style="color:#6366f1; -webkit-text-fill-color:#6366f1;">X</span>
            </div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 8px;">Enter Platform</div>
            <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.5;">Please sign in with your Google account to unlock your creator workspace and sync campaigns.</p>
            
            <button class="auth-popup-btn" id="elitex-auth-signin-btn">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign in with Google
            </button>
            <div id="elitex-auth-error" style="color: #f87171; font-size: 0.72rem; margin-top: 12px; display: none;"></div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('elitex-auth-signin-btn').onclick = () => {
        const errorEl = document.getElementById('elitex-auth-error');
        if (errorEl) errorEl.style.display = 'none';
        
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        
        firebase.auth().signInWithPopup(provider)
            .then(result => {
                console.log("[EliteX] Successful sign in with popup:", result.user.email);
                hideAuthOverlay();
            })
            .catch(err => {
                console.error("[EliteX] Popup sign in failed:", err);
                if (errorEl) {
                    errorEl.textContent = "Sign in failed: " + err.message;
                    errorEl.style.display = 'block';
                }
            });
    };
}

function hideAuthOverlay() {
    const overlay = document.getElementById('elitex-auth-overlay');
    if (overlay) {
        overlay.style.transition = 'opacity 0.2s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
    }
}

function initFirebase() {
    loadFirebaseSDKs(() => {
        try {
            const config = getFirebaseConfig();
            if (!firebase.apps.length) firebase.initializeApp(config);

            window.firebaseDb = firebase.database();
            _fbReady = true;

            console.log('[EliteX] 🔥 Firebase connected → elitex-fd3c0-default-rtdb');
            window.dispatchEvent(new Event('firebase_sync_active'));

            // Check auth state
            const auth = firebase.auth();
            auth.onAuthStateChanged(user => {
                const bypass = window.location.protocol === 'file:' || localStorage.getItem('elitex_bypass_auth') === 'true';
                // Require authentication overlay across the entire creator/user section (excluding admin.html and sign.html)
                const isUserSection = !window.location.pathname.includes('admin.html') && 
                                      !window.location.pathname.includes('sign.html');
                
                if (!user && !bypass && isUserSection) {
                    showAuthOverlay();
                } else if (user) {
                    console.log('[EliteX] 👤 Authenticated user:', user.email);
                    hideAuthOverlay();
                    updateDOMProfile(user);
                }
            });

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
                    security_amount:     { cache: 'elitex_security_amount',     fallback: '49.00' },
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
                    
                    if (auth.currentUser) {
                        updateDOMProfile(auth.currentUser);
                    }
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
        security_amount:     localStorage.getItem('elitex_security_amount') || '49.00',
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
    const res = _cacheGet('elitex_orders', []);
    if (Array.isArray(res)) return res;
    if (res && typeof res === 'object') return Object.values(res);
    return [];
}

function getAllProducts() {
    const rawCustom = _cacheGet('elitex_custom_products', []);
    const custom = Array.isArray(rawCustom) ? rawCustom : (rawCustom && typeof rawCustom === 'object' ? Object.values(rawCustom) : []);
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
    // Allow cancellation if ordered (before video submission), return if video_submitted or delivered
    const idx = orders.findIndex(o => o.productId === productId && (o.status === 'video_submitted' || o.status === 'ordered' || o.status === 'delivered'));

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
        desc: (oldStatus === 'ordered' || oldStatus === 'delivered') ? `Order Cancelled: ${order.name}` : `Product Returned: ${order.name}`,
        amount: order.price,
        type: 'income',
        typeName: 'Refund Received',
        avatarClass: 'credit',
        iconClass: 'ph-arrow-counter-clockwise',
        date: new Date().toLocaleDateString()
    });
    
    const activityText = (oldStatus === 'ordered' || oldStatus === 'delivered') 
        ? `Cancelled order for ${order.name} — ₹${order.price.toFixed(2)} refunded`
        : `Returned ${order.name} — ₹${order.price.toFixed(2)} refunded`;
        
    addActivity(activityText, 'emerald');
    triggerSync();
    return { success: true, msg: "Refunded successfully!" };
}

function getSubmissions() {
    const res = _cacheGet('elitex_submissions', []);
    if (Array.isArray(res)) return res;
    if (res && typeof res === 'object') return Object.values(res);
    return [];
}


function addSubmission(campaignId, videoUrl) {
    const campaign = DEFAULT_CAMPAIGNS.find(c => c.id === campaignId);
    if (!campaign) return { success: false, msg: "Campaign target not found." };

    // Validation checks
    if (campaign.type === 'buy_to_review') {
        const orders = getOrders();
        const order = orders.find(o => o.productId === campaign.productId && (o.status === 'ordered' || o.status === 'delivered'));
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
    if ((sub.status || 'pending') !== 'pending') return { success: false, msg: "This submission has already been reviewed." };

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
        const order  = orders.find(o => o.productId === sub.productId && (o.status === 'ordered' || o.status === 'delivered'));
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
    const res = _cacheGet('elitex_joined_campaigns', []);
    if (Array.isArray(res)) return res;
    if (res && typeof res === 'object') return Object.values(res);
    return [];
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
    const res = _cacheGet('elitex_activities', []);
    if (Array.isArray(res)) return res;
    if (res && typeof res === 'object') return Object.values(res);
    return [];
}

function addActivity(text, type = 'indigo') {
    const feed = getActivityFeed();
    feed.unshift({ text, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    _cacheSet('elitex_activities', feed.slice(0, 30));
    window.dispatchEvent(new Event('elitex_activities_updated'));
    // Note: caller handles triggerSync() to batch writes
}

function getCustomTransactions() {
    const res = _cacheGet('elitex_custom_transactions', []);
    if (Array.isArray(res)) return res;
    if (res && typeof res === 'object') return Object.values(res);
    return [];
}

function addTransaction(txn) {
    try {
        const list = getCustomTransactions();
        const newTxn = {
            date: txn.date || new Date().toLocaleDateString(),
            ref: txn.ref || ('TXN-' + Math.floor(100000 + Math.random() * 900000)),
            type: txn.type || 'income',
            desc: txn.desc || '',
            amount: parseFloat(txn.amount || 0),
            typeName: txn.typeName || (txn.type === 'income' ? 'Task Payout' : 'Order Placed'),
            avatarClass: txn.avatarClass || (txn.amount >= 0 ? 'credit' : 'debit'),
            iconClass: txn.iconClass || (txn.amount >= 0 ? 'ph-handshake' : 'ph-shopping-cart-simple')
        };
        list.unshift(newTxn);
        _cacheSet('elitex_custom_transactions', list);
        window.dispatchEvent(new Event('storage'));
    } catch (e) {
        console.error("Error adding transaction:", e);
    }
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

// ==================== ORDER MANAGEMENT PORTAL & SUBMENU ====================

function injectOrderPortal() {
    if (document.getElementById('order-portal-modal')) return;
    
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        /* Order Portal Modal Styles */
        .order-portal-modal {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(9, 9, 11, 0.85);
            backdrop-filter: blur(8px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-sizing: border-box;
        }
        .order-portal-modal.active {
            display: flex;
            opacity: 1;
        }
        .order-portal-box {
            background: #18181b;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            width: 90%;
            max-width: 500px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-sizing: border-box;
        }
        .order-portal-modal.active .order-portal-box {
            transform: scale(1);
        }
        .order-portal-header {
            padding: 18px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .order-portal-header h3 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #fff;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .order-portal-close {
            background: transparent;
            border: none;
            color: #a1a1aa;
            font-size: 1.25rem;
            cursor: pointer;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .order-portal-close:hover {
            color: #fff;
        }
        .order-portal-tabs {
            display: flex;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(255, 255, 255, 0.01);
        }
        .order-portal-tab-btn {
            flex: 1;
            padding: 14px;
            background: transparent;
            border: none;
            color: #a1a1aa;
            font-size: 0.82rem;
            font-weight: 600;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .order-portal-tab-btn:hover {
            color: #fff;
        }
        .order-portal-tab-btn.active {
            color: #6366f1;
            border-bottom-color: #6366f1;
            background: rgba(99, 102, 241, 0.05);
        }
        .order-portal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
            box-sizing: border-box;
        }
        .order-item-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 12px;
            box-sizing: border-box;
            text-align: left;
        }
        .order-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
            gap: 10px;
        }
        .order-item-title {
            font-weight: 600;
            color: #fff;
            font-size: 0.88rem;
            line-height: 1.3;
        }
        .order-item-meta {
            font-size: 0.7rem;
            color: #a1a1aa;
            margin-top: 4px;
        }
        .order-item-price {
            font-weight: 700;
            color: #6366f1;
            font-size: 0.88rem;
            font-family: 'JetBrains Mono', monospace;
            flex-shrink: 0;
        }
        .order-item-status-bar {
            height: 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 99px;
            margin: 12px 0 6px 0;
            overflow: hidden;
        }
        .order-item-status-fill {
            height: 100%;
            background: linear-gradient(90deg, #6366f1, #a855f7);
            border-radius: 99px;
        }
        .order-item-status-text {
            display: flex;
            justify-content: space-between;
            font-size: 0.68rem;
            color: #a1a1aa;
        }
        .order-action-btn {
            width: 100%;
            padding: 8px 12px;
            background: #6366f1;
            border: none;
            border-radius: 8px;
            color: #fff;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.2s;
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .order-action-btn:hover {
            background: #4f46e5;
        }
        .order-action-btn.btn-cancel {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #ef4444;
        }
        .order-action-btn.btn-cancel:hover {
            background: rgba(239, 68, 68, 0.2);
        }
        .order-action-btn.btn-return {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            color: #10b981;
        }
        .order-action-btn.btn-return:hover {
            background: rgba(16, 185, 129, 0.2);
        }
        .order-portal-empty {
            text-align: center;
            padding: 30px 10px;
            color: #a1a1aa;
        }
        .order-portal-empty i {
            font-size: 2.2rem;
            margin-bottom: 8px;
            opacity: 0.3;
            display: block;
        }
        .order-portal-empty p {
            font-size: 0.8rem;
            margin: 0;
        }
        
        /* Sidebar Submenu Styles */
        .sidebar-submenu-container {
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .nav-shop-toggle {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
        }
        .sidebar-submenu {
            display: none;
            flex-direction: column;
            padding-left: 20px;
            gap: 4px;
            margin-top: 4px;
        }
        .sidebar-submenu.active {
            display: flex;
        }
        .submenu-item {
            font-size: 0.8rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            padding: 8px 12px !important;
            border-radius: 8px !important;
            color: #a1a1aa !important;
            text-decoration: none !important;
            transition: all 0.2s !important;
        }
        .submenu-item:hover {
            color: #fff !important;
            background: rgba(255, 255, 255, 0.03) !important;
        }
        .submenu-item.active {
            color: #6366f1 !important;
            background: rgba(99, 102, 241, 0.05) !important;
        }
        .submenu-caret {
            transition: transform 0.2s;
        }
        .nav-shop-toggle.expanded .submenu-caret {
            transform: rotate(180deg);
        }
    `;
    document.head.appendChild(style);
    
    // Inject HTML
    const div = document.createElement('div');
    div.id = 'order-portal-modal';
    div.className = 'order-portal-modal';
    div.innerHTML = `
        <div class="order-portal-box">
            <div class="order-portal-header">
                <h3><i class="ph ph-shopping-bag" style="color: #a78bfa;"></i> Order Management</h3>
                <button class="order-portal-close" onclick="closeOrderPortal()"><i class="ph ph-x"></i></button>
            </div>
            <div class="order-portal-tabs">
                <button class="order-portal-tab-btn active" id="order-portal-tab-track" onclick="openOrderPortal('track')">Track Order</button>
                <button class="order-portal-tab-btn" id="order-portal-tab-cancel" onclick="openOrderPortal('cancel')">Cancel Order</button>
                <button class="order-portal-tab-btn" id="order-portal-tab-return" onclick="openOrderPortal('return')">Return Order</button>
            </div>
            <div class="order-portal-body" id="order-portal-body">
                <!-- Rendered dynamically -->
            </div>
        </div>
    `;
    document.body.appendChild(div);
    
    div.addEventListener('click', (e) => {
        if (e.target === div) closeOrderPortal();
    });
}

window.toggleShopSubmenu = function(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const submenu = document.getElementById('shop-submenu');
    const toggle = document.querySelector('.nav-shop-toggle');
    if (submenu && toggle) {
        const isHidden = submenu.style.display === 'none' || !submenu.classList.contains('active');
        if (isHidden) {
            submenu.style.display = 'flex';
            submenu.classList.add('active');
            toggle.classList.add('expanded');
            localStorage.setItem('elitex_shop_submenu_expanded', 'true');
        } else {
            submenu.style.display = 'none';
            submenu.classList.remove('active');
            toggle.classList.remove('expanded');
            localStorage.setItem('elitex_shop_submenu_expanded', 'false');
        }
    }
};

window.openOrderPortal = function(tabName = 'track') {
    const modal = document.getElementById('order-portal-modal');
    if (!modal) return;
    
    const tabs = ['track', 'cancel', 'return'];
    tabs.forEach(t => {
        const btn = document.getElementById(`order-portal-tab-${t}`);
        if (btn) {
            if (t === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
    
    renderOrderPortalContent(tabName);
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
};

window.closeOrderPortal = function() {
    const modal = document.getElementById('order-portal-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
};

window.renderOrderPortalContent = function(tabName) {
    const body = document.getElementById('order-portal-body');
    if (!body) return;
    
    const orders = getOrders();
    
    if (orders.length === 0) {
        body.innerHTML = `
            <div class="order-portal-empty">
                <i class="ph ph-shopping-bag"></i>
                <p>No orders found. Visit the Shop to order jewelry samples.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    if (tabName === 'track') {
        orders.forEach(o => {
            let progress = 30;
            let statusText = 'Processing Order';
            let statusColor = '#a1a1aa';
            
            if (o.status === 'ordered') {
                progress = 60;
                statusText = 'Shipped / In Transit';
                statusColor = '#fbbf24';
            } else if (o.status === 'video_submitted') {
                progress = 100;
                statusText = 'Delivered & Confirmed';
                statusColor = '#10b981';
            } else if (o.status === 'returned') {
                progress = 100;
                statusText = 'Cancelled / Returned';
                statusColor = '#ef4444';
            }
            
            html += `
                <div class="order-item-card">
                    <div class="order-item-header">
                        <div>
                            <div class="order-item-title">${o.name}</div>
                            <div class="order-item-meta">ID: ${o.orderId} • Ordered: ${o.date}</div>
                        </div>
                        <div class="order-item-price">₹${o.price.toFixed(2)}</div>
                    </div>
                    <div class="order-item-status-bar">
                        <div class="order-item-status-fill" style="width: ${progress}%; background: ${o.status === 'returned' ? '#ef4444' : 'linear-gradient(90deg, #6366f1, #a855f7)'}"></div>
                    </div>
                    <div class="order-item-status-text">
                        <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span>
                        <span>Estimated: 2-3 Days</span>
                    </div>
                </div>
            `;
        });
    } else if (tabName === 'cancel') {
        const cancellable = orders.filter(o => o.status === 'ordered');
        if (cancellable.length === 0) {
            body.innerHTML = `
                <div class="order-portal-empty">
                    <i class="ph ph-x-circle"></i>
                    <p>No cancellable orders found. Orders can only be cancelled before video reviews are submitted.</p>
                </div>
            `;
            return;
        }
        
        cancellable.forEach(o => {
            html += `
                <div class="order-item-card">
                    <div class="order-item-header">
                        <div>
                            <div class="order-item-title">${o.name}</div>
                            <div class="order-item-meta">ID: ${o.orderId} • Ordered: ${o.date}</div>
                        </div>
                        <div class="order-item-price">₹${o.price.toFixed(2)}</div>
                    </div>
                    <button class="order-action-btn btn-cancel" onclick="portalCancelOrder('${o.productId}', '${o.name}')"><i class="ph ph-trash"></i> Cancel Order & Refund</button>
                </div>
            `;
        });
    } else if (tabName === 'return') {
        const returnable = orders.filter(o => o.status === 'video_submitted');
        if (returnable.length === 0) {
            body.innerHTML = `
                <div class="order-portal-empty">
                    <i class="ph ph-arrow-counter-clockwise"></i>
                    <p>No returnable orders found. You can return jewelry samples for a full refund after submitting your promotional video review.</p>
                </div>
            `;
            return;
        }
        
        returnable.forEach(o => {
            html += `
                <div class="order-item-card">
                    <div class="order-item-header">
                        <div>
                            <div class="order-item-title">${o.name}</div>
                            <div class="order-item-meta">ID: ${o.orderId} • Video Reviewed</div>
                        </div>
                        <div class="order-item-price">₹${o.price.toFixed(2)}</div>
                    </div>
                    <button class="order-action-btn btn-return" onclick="portalReturnOrder('${o.productId}', '${o.name}')"><i class="ph ph-arrow-counter-clockwise"></i> Return Jewelry & Refund</button>
                </div>
            `;
        });
    }
    
    body.innerHTML = html;
};

window.portalCancelOrder = function(productId, productName) {
    if (confirm(`Are you sure you want to cancel the order for ${productName}? Your wallet will be refunded immediately.`)) {
        const res = returnProduct(productId);
        if (res.success) {
            alert(`Order Cancelled: ${res.msg}`);
            renderOrderPortalContent('cancel');
            window.dispatchEvent(new Event('elitex_balance_updated'));
            window.dispatchEvent(new Event('elitex_data_changed'));
            if (typeof renderShop === 'function') renderShop();
            if (typeof loadDashboardMetrics === 'function') loadDashboardMetrics();
        } else {
            alert(`Error: ${res.msg}`);
        }
    }
};

window.portalReturnOrder = function(productId, productName) {
    if (confirm(`Are you sure you want to return the sample jewelry ${productName}? Your wallet will be refunded immediately.`)) {
        const res = returnProduct(productId);
        if (res.success) {
            alert(`Return Successful: ${res.msg}`);
            renderOrderPortalContent('return');
            window.dispatchEvent(new Event('elitex_balance_updated'));
            window.dispatchEvent(new Event('elitex_data_changed'));
            if (typeof renderShop === 'function') renderShop();
            if (typeof loadDashboardMetrics === 'function') loadDashboardMetrics();
        } else {
            alert(`Error: ${res.msg}`);
        }
    }
};

function setupSidebarSubmenu() {
    const isExpanded = localStorage.getItem('elitex_shop_submenu_expanded') === 'true';
    const submenu = document.getElementById('shop-submenu');
    const toggle = document.querySelector('.nav-shop-toggle');
    if (submenu && toggle) {
        if (isExpanded) {
            submenu.style.display = 'flex';
            submenu.classList.add('active');
            toggle.classList.add('expanded');
        } else {
            submenu.style.display = 'none';
            submenu.classList.remove('active');
            toggle.classList.remove('expanded');
        }
    }
    
    // Highlight browse shop if on shop.html
    const currentPath = window.location.pathname;
    const page = currentPath.split("/").pop();
    if (page === 'shop.html') {
        const browseBtn = document.querySelector('.submenu-item[href="shop.html"]');
        if (browseBtn) browseBtn.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    injectOrderPortal();
    setupSidebarSubmenu();
});
