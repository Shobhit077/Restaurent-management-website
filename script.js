document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. Smooth Scrolling for Navigation
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            if (hash && hash.startsWith('#') && hash !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(hash);
                if (target) {
                    // Close mobile menu
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                    }

                    // Smooth scroll
                    window.scrollTo({
                        top: target.offsetTop - 70, // offset for navbar
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 4. Menu Filtering
    const menuFilters = document.querySelectorAll('.menu-filter');
    const menuCards = document.querySelectorAll('.menu-card');

    menuFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            menuFilters.forEach(btn => btn.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.getAttribute('data-filter');

            menuCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. Form Validation & Backend Submission
    const resDateInput = document.getElementById('resDate');
    if(resDateInput) {
        const today = new Date().toISOString().split('T')[0];
        resDateInput.setAttribute('min', today);
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '#333333';
            }
        });
        return isValid;
    }

    // Reservation Form
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateForm(reservationForm)) {
                alert('Please fill out all required fields.');
                return;
            }

            const btn = reservationForm.querySelector('button[type="submit"]');
            btn.textContent = 'Processing...';

            const payload = {
                name: reservationForm.querySelectorAll('input')[0].value,
                email: reservationForm.querySelectorAll('input')[1].value,
                phone: reservationForm.querySelectorAll('input')[2].value,
                guests: reservationForm.querySelector('select').value,
                date: reservationForm.querySelectorAll('input')[3].value,
                time: reservationForm.querySelectorAll('input')[4].value,
                specialRequests: reservationForm.querySelector('textarea').value
            };

            try {
                const response = await fetch('/api/reservations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                
                if (data.success) {
                    alert(data.message);
                    reservationForm.reset();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (err) {
                alert('An error occurred while communicating with the server.');
            } finally {
                btn.textContent = 'Confirm Reservation';
            }
        });
    }

    // Review Form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateForm(reviewForm)) {
                alert('Please fill out all required fields.');
                return;
            }

            const payload = {
                name: reviewForm.querySelector('input').value,
                rating: reviewForm.querySelector('select').value,
                text: reviewForm.querySelector('textarea').value
            };

            try {
                const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                
                if (data.success) {
                    alert(data.message);
                    reviewForm.reset();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (err) {
                alert('An error occurred while communicating with the server.');
            }
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateForm(contactForm)) {
                alert('Please fill out all required fields.');
                return;
            }

            const payload = {
                name: contactForm.querySelectorAll('input')[0].value,
                email: contactForm.querySelectorAll('input')[1].value,
                subject: contactForm.querySelectorAll('input')[2].value,
                message: contactForm.querySelector('textarea').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                
                if (data.success) {
                    alert(data.message);
                    contactForm.reset();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (err) {
                alert('An error occurred while communicating with the server.');
            }
        });
    }

    // 6. Dynamic Content Fetching
    async function loadDynamicContent() {
        try {
            const res = await fetch('/api/public/data');
            const data = await res.json();
            
            if (data.success) {
                // Render Menu (if items exist in DB, overwrite hardcoded)
                if (data.menu && data.menu.length > 0) {
                    const menuGrid = document.querySelector('.menu-grid');
                    if (menuGrid) {
                        menuGrid.innerHTML = data.menu.map(m => `
                            <div class="menu-card" data-category="${m.category.toLowerCase()}">
                                <img src="${m.imageUrl}" alt="${m.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'">
                                <div class="menu-info">
                                    <div class="menu-header">
                                        <h3>${m.name}</h3>
                                        <span class="price">₹${m.price}</span>
                                    </div>
                                    <p>${m.description || ''}</p>
                                    <div class="menu-footer">
                                        <span class="rating"><i class="fas fa-star"></i> 4.5</span>
                                        <button class="btn btn-sm btn-outline">Order Now</button>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }
                }

                // Render Gallery
                if (data.gallery && data.gallery.length > 0) {
                    const galGrid = document.querySelector('.gallery-grid');
                    if (galGrid) {
                        galGrid.innerHTML = data.gallery.map(g => `
                            <img src="${g.imageUrl}" alt="${g.category || 'Gallery image'}" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'">
                        `).join('');
                    }
                }
            }
        } catch (err) {
            console.error("Failed to load dynamic content:", err);
        }
    }

    loadDynamicContent();
});
