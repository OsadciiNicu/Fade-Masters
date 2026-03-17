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

// ===== API VREME - OPEN-METEO (FĂRĂ CHEIE, GRATUIT) =====

function displayWeather() {
    // Coordonate Chișinău: latitudine 47.01, longitudine 28.86
    fetch('https://api.open-meteo.com/v1/forecast?latitude=47.01&longitude=28.86&current_weather=true&hourly=temperature_2m&timezone=auto')
        .then(response => response.json())
        .then(data => {
            console.log('Date meteo Open-Meteo:', data);
            
            // Extrage datele curente
            const temp = Math.round(data.current_weather.temperature);
            const wind = data.current_weather.windspeed;
            const code = data.current_weather.weathercode;
            
            // Dicționar pentru codurile meteo Open-Meteo
            const weatherDescriptions = {
                0: '☀️ Senin',
                1: '🌤️ Mai mult senin',
                2: '⛅ Parțial noros',
                3: '☁️ Înnorat',
                45: '🌫️ Ceață',
                48: '🌫️ Ceață depusă',
                51: '🌧️ Burniță ușoară',
                53: '🌧️ Burniță moderată',
                55: '🌧️ Burniță densă',
                56: '🌧️ Burniță înghețată ușoară',
                57: '🌧️ Burniță înghețată densă',
                61: '🌧️ Ploaie ușoară',
                63: '🌧️ Ploaie moderată',
                65: '🌧️ Ploaie puternică',
                66: '🌧️ Ploaie înghețată ușoară',
                67: '🌧️ Ploaie înghețată puternică',
                71: '❄️ Ninsoare ușoară',
                73: '❄️ Ninsoare moderată',
                75: '❄️ Ninsoare puternică',
                77: '❄️ Grindină',
                80: '🌧️ Averse ușoare',
                81: '🌧️ Averse moderate',
                82: '🌧️ Averse violente',
                85: '❄️ Averse de zăpadă ușoare',
                86: '❄️ Averse de zăpadă puternice',
                95: '⛈️ Furtună',
                96: '⛈️ Furtună cu grindină ușoară',
                99: '⛈️ Furtună cu grindină puternică'
            };
            
            const description = weatherDescriptions[code] || '🌡️ Vreme variabilă';
            
            // Creează elementul pentru vreme dacă nu există
            let weatherDiv = document.getElementById('weather-info');
            if (!weatherDiv) {
                weatherDiv = document.createElement('div');
                weatherDiv.id = 'weather-info';
                weatherDiv.style.position = 'fixed';
                weatherDiv.style.top = '100px';
                weatherDiv.style.right = '30px';
                weatherDiv.style.backgroundColor = '#d4af37';
                weatherDiv.style.color = '#0a0a0a';
                weatherDiv.style.padding = '12px 18px';
                weatherDiv.style.borderRadius = '8px';
                weatherDiv.style.fontWeight = '500';
                weatherDiv.style.zIndex = '999';
                weatherDiv.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                weatherDiv.style.fontSize = '14px';
                weatherDiv.style.minWidth = '200px';
                document.body.appendChild(weatherDiv);
            }
            
            // Afișează vremea frumos
            weatherDiv.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.1); padding-bottom:8px;">
                    <span style="font-size:28px;">${description.split(' ')[0]}</span>
                    <span style="font-size:20px; font-weight:bold;">${temp}°C</span>
                </div>
                <div style="margin-bottom:5px; text-align:center;">
                    <span style="text-transform:capitalize;">${description}</span>
                </div>
                <div style="display:flex; align-items:center; justify-content:center; gap:10px;">
                    <span style="font-size:16px;">💨</span>
                    <span>Vânt: ${wind} km/h</span>
                </div>
                <div style="margin-top:8px; font-size:11px; text-align:center; color:#333; border-top:1px solid rgba(0,0,0,0.1); padding-top:6px;">
                    Chișinău • actualizat acum
                </div>
            `;
            
            console.log('✅ Vreme afișată:', temp + '°C', description);
        })
        .catch(error => {
            console.error('❌ Eroare la încărcarea vremii:', error);
            
            // Afișează un mesaj de eroare prietenos
            let weatherDiv = document.getElementById('weather-info');
            if (!weatherDiv) {
                weatherDiv = document.createElement('div');
                weatherDiv.id = 'weather-info';
                weatherDiv.style.position = 'fixed';
                weatherDiv.style.top = '100px';
                weatherDiv.style.right = '30px';
                weatherDiv.style.backgroundColor = '#d4af37';
                weatherDiv.style.color = '#0a0a0a';
                weatherDiv.style.padding = '12px 18px';
                weatherDiv.style.borderRadius = '8px';
                weatherDiv.style.zIndex = '999';
                document.body.appendChild(weatherDiv);
            }
            weatherDiv.innerHTML = '🌡️ Vremea nu este disponibilă momentan';
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
    
    // Actualizează afișarea în pagină
    displayHistoryOnPage();
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
    
    // Actualizează afișarea în pagină
    displayHistoryOnPage();
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

// ===== AFIȘARE ISTORIC ÎN PAGINĂ (MAI JOS DE PROGRAMARE) =====

// Funcție pentru a crea secțiunea de istoric în pagină
function createHistorySection() {
    // Verifică dacă secțiunea există deja
    if (document.getElementById('history-section')) return;
    
    // Creează secțiunea principală
    const section = document.createElement('section');
    section.id = 'history-section';
    section.style.padding = '60px 20px';
    section.style.backgroundColor = '#111';
    section.style.textAlign = 'center';
    
    // Titlu secțiune
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Istoricul tău';
    title.style.marginBottom = '40px';
    
    // Container pentru istoric
    const container = document.createElement('div');
    container.id = 'history-container';
    container.style.maxWidth = '1000px';
    container.style.margin = '0 auto';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '30px';
    container.style.justifyContent = 'center';
    
    // Coloana pentru programări
    const bookingsColumn = document.createElement('div');
    bookingsColumn.style.flex = '1 1 400px';
    bookingsColumn.style.backgroundColor = '#1a1a1a';
    bookingsColumn.style.borderRadius = '10px';
    bookingsColumn.style.padding = '25px';
    bookingsColumn.style.border = '1px solid #d4af37';
    
    const bookingsTitle = document.createElement('h3');
    bookingsTitle.textContent = '📅 Programări recente';
    bookingsTitle.style.color = '#d4af37';
    bookingsTitle.style.marginBottom = '20px';
    bookingsTitle.style.fontSize = '22px';
    bookingsTitle.style.borderBottom = '1px solid #333';
    bookingsTitle.style.paddingBottom = '10px';
    
    const bookingsList = document.createElement('div');
    bookingsList.id = 'bookings-list';
    bookingsList.style.minHeight = '100px';
    
    // Coloana pentru comenzi
    const ordersColumn = document.createElement('div');
    ordersColumn.style.flex = '1 1 400px';
    ordersColumn.style.backgroundColor = '#1a1a1a';
    ordersColumn.style.borderRadius = '10px';
    ordersColumn.style.padding = '25px';
    ordersColumn.style.border = '1px solid #d4af37';
    
    const ordersTitle = document.createElement('h3');
    ordersTitle.textContent = '🛒 Comenzi recente';
    ordersTitle.style.color = '#d4af37';
    ordersTitle.style.marginBottom = '20px';
    ordersTitle.style.fontSize = '22px';
    ordersTitle.style.borderBottom = '1px solid #333';
    ordersTitle.style.paddingBottom = '10px';
    
    const ordersList = document.createElement('div');
    ordersList.id = 'orders-list';
    ordersList.style.minHeight = '100px';
    
    // Asamblare
    bookingsColumn.appendChild(bookingsTitle);
    bookingsColumn.appendChild(bookingsList);
    
    ordersColumn.appendChild(ordersTitle);
    ordersColumn.appendChild(ordersList);
    
    container.appendChild(bookingsColumn);
    container.appendChild(ordersColumn);
    
    section.appendChild(title);
    section.appendChild(container);
    
    // Adaugă secțiunea după Programare
    const programareSection = document.getElementById('programare');
    if (programareSection) {
        programareSection.parentNode.insertBefore(section, programareSection.nextSibling);
    } else {
        document.body.appendChild(section);
    }
}

// Funcție pentru a afișa programările în pagină
function displayBookingsOnPage() {
    const bookingsList = document.getElementById('bookings-list');
    if (!bookingsList) return;
    
    const bookings = loadBookingHistory();
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p style="color:#aaa; text-align:center; padding:20px;">Nu există programări încă.</p>';
        return;
    }
    
    bookingsList.innerHTML = '';
    
    // Afișează doar ultimele 5 programări
    bookings.slice(0, 5).forEach(booking => {
        const item = document.createElement('div');
        item.style.marginBottom = '15px';
        item.style.padding = '12px';
        item.style.backgroundColor = '#0a0a0a';
        item.style.borderRadius = '8px';
        item.style.borderLeft = '3px solid #d4af37';
        item.style.textAlign = 'left';
        
        const dataProgramare = booking.data ? `${booking.data} ${booking.ora}` : booking.dataProgramare;
        
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="color:#d4af37; font-weight:600;">${booking.nume}</span>
                <span style="color:#aaa; font-size:12px;">${booking.dataProgramare || ''}</span>
            </div>
            <div style="color:#fff; font-size:14px; margin-bottom:5px;">${booking.serviciu}</div>
            <div style="color:#aaa; font-size:12px;">📅 ${dataProgramare}</div>
        `;
        
        bookingsList.appendChild(item);
    });
}

// Funcție pentru a afișa comenzile în pagină
function displayOrdersOnPage() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;
    
    const orders = loadOrderHistory();
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="color:#aaa; text-align:center; padding:20px;">Nu există comenzi încă.</p>';
        return;
    }
    
    ordersList.innerHTML = '';
    
    // Afișează doar ultimele 5 comenzi
    orders.slice(0, 5).forEach(order => {
        const item = document.createElement('div');
        item.style.marginBottom = '15px';
        item.style.padding = '12px';
        item.style.backgroundColor = '#0a0a0a';
        item.style.borderRadius = '8px';
        item.style.borderLeft = '3px solid #d4af37';
        item.style.textAlign = 'left';
        
        // Creează lista scurtă de produse
        const produseShort = order.produse.slice(0, 2).map(p => 
            `${p.nume} x${p.cantitate}`
        ).join(', ');
        
        const extraProduse = order.produse.length > 2 ? ` +${order.produse.length - 2} produse` : '';
        
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="color:#d4af37; font-weight:600;">Comandă #${order.dataComanda.slice(0,10)}</span>
                <span style="color:#d4af37;">${order.totalComanda} Lei</span>
            </div>
            <div style="color:#fff; font-size:14px; margin-bottom:5px;">
                ${produseShort}${extraProduse}
            </div>
            <div style="color:#aaa; font-size:12px;">
                📦 ${order.numarProduse} produse • ${order.dataComanda}
            </div>
        `;
        
        ordersList.appendChild(item);
    });
}

// Funcție principală pentru afișarea istoricului în pagină
function displayHistoryOnPage() {
    // Creează secțiunea dacă nu există (indiferent dacă sunt date sau nu)
    if (!document.getElementById('history-section')) {
        createHistorySection();
    }
    
    // Afișează programările și comenzile
    displayBookingsOnPage();
    displayOrdersOnPage();
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
    
    // Afișează secțiunea de istoric (chiar dacă e goală)
    displayHistoryOnPage();
    
    // Afișează vremea la încărcarea paginii
    displayWeather();
    
    // Actualizează vremea la fiecare 30 minute
    setInterval(displayWeather, 30 * 60 * 1000);
});

// Pentru a vedea istoricul oricând din consolă
window.veziIstoric = showAllHistory;

window.observeAnimatedElements = observeAnimateđElements;
observeAnimatedElements();