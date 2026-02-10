 let cart = [];
        let cartCount = 0;
        let totalAmount = 0;

        // Funcții pentru coș
        function addToCart(name, price) {
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCart();
            showCartNotification();
        }

        function removeFromCart(name) {
            cart = cart.filter(item => item.name !== name);
            updateCart();
        }

        function updateQuantity(name, change) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(name);
                } else {
                    updateCart();
                }
            }
        }

        function updateCart() {
            const cartItems = document.querySelector('.cart-items');
            const cartCountElement = document.querySelector('.cart-count');
            const totalAmountElement = document.querySelector('.total-amount');
            
            // Update cart items
            cartItems.innerHTML = '';
            cartCount = 0;
            totalAmount = 0;
            
            cart.forEach(item => {
                cartCount += item.quantity;
                totalAmount += item.price * item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} Lei</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart('${item.name}')">Șterge</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Update counters
            cartCountElement.textContent = cartCount;
            totalAmountElement.textContent = totalAmount;
        }

        function toggleCart() {
            const cartModal = document.querySelector('.cart-modal');
            const overlay = document.querySelector('.overlay');
            
            cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
            overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
        }

        function closeCart() {
            document.querySelector('.cart-modal').style.display = 'none';
            document.querySelector('.overlay').style.display = 'none';
        }

        function showCartNotification() {
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.style.animation = 'bounce 0.5s';
            setTimeout(() => {
                cartIcon.style.animation = '';
            }, 500);
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Coșul tău este gol!');
                return;
            }
            
            const orderDetails = cart.map(item => 
                `${item.name} x${item.quantity} - ${item.price * item.quantity} Lei`
            ).join('\n');
            
            alert(`Comandă finalizată!\n\nProduse:\n${orderDetails}\n\nTotal: ${totalAmount} Lei\n\nVă mulțumim pentru comandă!`);
            
            // Reset cart
            cart = [];
            updateCart();
            closeCart();
        }

        // Adăugăm animația bounce
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(style);

        // Efect de scroll pentru navigație
        window.addEventListener('scroll', function() {
            const navigation = document.querySelector('.navigation');
            if (window.scrollY > 100) {
                navigation.style.padding = '15px 0';
                navigation.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            } else {
                navigation.style.padding = '30px 0';
                navigation.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
            }
        });

        // Animare pentru elementele care apar la scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Aplică animația pentru carduri și alte elemente
        function observeAnimatedElements() {
            document.querySelectorAll('.serviciu-card, .produs-card, .despre-content, .despre-image').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(el);
            });
        }

        // expunem funcția ca să o poți apela după ce randezi din JSON
        window.observeAnimatedElements = observeAnimatedElements;
        observeAnimatedElements();