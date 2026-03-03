// Debug
const log = (...args) => { console.log("[fpc]", ...args); };
log("loaded");

let cart = [];

// Funcții coș
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    updateCart();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(name);
        else updateCart();
    }
}

function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalSpan = document.querySelector('.total-amount');
    
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;
    
    cart.forEach(item => {
        count += item.quantity;
        total += item.price * item.quantity;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <div>${item.name}</div>
                <div style="color:#d4af37">${item.price} Lei</div>
            </div>
            <div>
                <button onclick="updateQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.name}', 1)">+</button>
                <button onclick="removeFromCart('${item.name}')">X</button>
            </div>
        `;
        cartItems.appendChild(div);
    });
    
    cartCount.textContent = count;
    totalSpan.textContent = total;
}

function toggleCart() {
    const m = document.querySelector('.cart-modal');
    const o = document.querySelector('.overlay');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
    o.style.display = o.style.display === 'block' ? 'none' : 'block';
}

function closeCart() {
    document.querySelector('.cart-modal').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Coș gol!');
        return;
    }
    
    // Salvează comanda în istoric înainte de a finaliza
    saveOrderToHistory();
    
    alert('Comandă finalizată! Total: ' + document.querySelector('.total-amount').textContent + ' Lei');
    cart = [];
    updateCart();
    closeCart();
}

// Scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navigation');
    if (window.scrollY > 100) {
        nav.style.padding = '15px 0';
        nav.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.padding = '30px 0';
        nav.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
    }
});

// Animații scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

function observeAnimatedElements() {
    document.querySelectorAll('.serviciu-card, .produs-card, .despre-content, .despre-image').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ===== ISTORIC PROGRAMĂRI =====

// Încarcă istoricul din localStorage
function loadBookingHistory() {
    const historyString = localStorage.getItem('istoricProgramari');
    return historyString ? JSON.parse(historyString) : [];
}

// Salvează o programare în istoric
function saveToHistory(bookingData) {
    const history = loadBookingHistory();
    
    // Adaugă data și ora curentă
    bookingData.dataProgramare = new Date().toLocaleString();
    
    // Adaugă în față (cea mai recentă prima)
    history.unshift(bookingData);
    
    // Păstrează doar ultimele 10 programări
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem('istoricProgramari', JSON.stringify(history));
    log('Programare salvată în istoric:', bookingData);
}

// Afișează istoricul în consolă
function showBookingHistory() {
    const history = loadBookingHistory();
    
    if (history.length === 0) {
        log('Nu există programări în istoric.');
        return;
    }
    
    log('=== ISTORIC PROGRAMĂRI ===');
    history.forEach((booking, index) => {
        log(`${index + 1}. ${booking.nume} - ${booking.serviciu} - ${booking.data} ${booking.ora}`);
    });
}

// Salvează când se trimite formularul de programare
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('programare-form')) {
        e.preventDefault();
        
        // Colectează datele din formular
        const nume = document.getElementById('nume')?.value.trim();
        const telefon = document.getElementById('telefon')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const serviciuSelect = document.getElementById('serviciu');
        const serviciu = serviciuSelect?.options[serviciuSelect.selectedIndex]?.text;
        const data = document.getElementById('data')?.value;
        const ora = document.getElementById('ora')?.value;
        const mesaj = document.getElementById('mesaj')?.value.trim();
        
        if (nume && serviciu && data && ora) {
            // Creează obiectul programării
            const booking = {
                tip: 'programare',
                nume: nume,
                telefon: telefon || '',
                email: email || '',
                serviciu: serviciu,
                data: data,
                ora: ora,
                mesaj: mesaj || '',
                dataProgramare: new Date().toLocaleString()
            };
            
            // Salvează în istoric
            saveToHistory(booking);
            
            // Afișează în consolă
            showBookingHistory();
            
            // Mesaj utilizator
            alert('Programare trimisă! Mulțumim, ' + nume + '!');
            
            // Reset formular
            e.target.reset();
        } else {
            alert('Te rugăm să completezi toate câmpurile obligatorii!');
        }
    }
});

// ===== ISTORIC COMENZI =====

// Încarcă istoricul comenzilor din localStorage
function loadOrderHistory() {
    const historyString = localStorage.getItem('istoricComenzi');
    return historyString ? JSON.parse(historyString) : [];
}

// Salvează o comandă în istoric
function saveOrderToHistory() {
    if (cart.length === 0) return;
    
    const history = loadOrderHistory();
    
    // Creează obiectul comenzii
    const order = {
        tip: 'comanda',
        dataComanda: new Date().toLocaleString(),
        produse: cart.map(item => ({
            nume: item.name,
            pret: item.price,
            cantitate: item.quantity,
            total: item.price * item.quantity
        })),
        totalComanda: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        numarProduse: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
    
    // Adaugă în față
    history.unshift(order);
    
    // Păstrează doar ultimele 10 comenzi
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem('istoricComenzi', JSON.stringify(history));
    log('Comandă salvată în istoric:', order);
}

// Afișează istoricul comenzilor în consolă
function showOrderHistory() {
    const history = loadOrderHistory();
    
    if (history.length === 0) {
        log('Nu există comenzi în istoric.');
        return;
    }
    
    log('=== ISTORIC COMENZI ===');
    history.forEach((order, index) => {
        log(`${index + 1}. Comanda din ${order.dataComanda} - ${order.numarProduse} produse - Total: ${order.totalComanda} Lei`);
        order.produse.forEach(p => {
            log(`   - ${p.nume} x${p.cantitate} = ${p.total} Lei`);
        });
    });
}

// ===== FUNCȚIE PENTRU A AFIȘA TOT ISTORICUL =====

function showAllHistory() {
    log('========== ISTORIC COMPLET ==========');
    showBookingHistory();
    showOrderHistory();
    log('=====================================');
}

// Afișează istoricul la încărcarea paginii
window.addEventListener('load', function() {
    const bookings = loadBookingHistory();
    const orders = loadOrderHistory();
    
    if (bookings.length > 0 || orders.length > 0) {
        log(`Ai ${bookings.length} programări și ${orders.length} comenzi în istoric.`);
        showAllHistory();
    } else {
        log('Nu există programări sau comenzi salvate.');
    }
});

// Pentru a vedea istoricul oricând din consolă
window.veziIstoric = showAllHistory;

window.observeAnimatedElements = observeAnimatedElements;
observeAnimatedElements();