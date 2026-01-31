// ===================================
// DaněNula.cz - Interactive Features
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // Navigation Scroll Effect
    // ===================================

    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Add scroll effect to navbar
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link, .btn-nav');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ===================================
    // Scroll Reveal Animations
    // ===================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });


    // ===================================
    // Pricing Card Auto-Selection
    // ===================================

    const pricingButtons = document.querySelectorAll('.pricing-cta');
    const serviceTypeSelect = document.getElementById('service-type');
    const formSection = document.getElementById('form');

    pricingButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the service type from data attribute
            const serviceType = this.getAttribute('data-service');

            // Scroll to form section
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const formPosition = formSection.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: formPosition,
                behavior: 'smooth'
            });

            // Wait for scroll to complete, then select the service type
            setTimeout(() => {
                if (serviceTypeSelect) {
                    serviceTypeSelect.value = serviceType;
                    // Add visual feedback
                    serviceTypeSelect.style.borderColor = 'var(--color-green-500)';
                    serviceTypeSelect.style.backgroundColor = 'var(--color-green-50)';

                    // Remove visual feedback after 2 seconds
                    setTimeout(() => {
                        serviceTypeSelect.style.borderColor = '';
                        serviceTypeSelect.style.backgroundColor = '';
                    }, 2000);
                }
            }, 800);
        });
    });


    // ===================================
    // Entity Type Toggle (OSVČ / s.r.o.)
    // ===================================

    const toggleOptions = document.querySelectorAll('.toggle-option');
    const entityTypeInput = document.getElementById('entity-type');

    toggleOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Remove active class from all options
            toggleOptions.forEach(opt => opt.classList.remove('active'));

            // Add active class to clicked option
            this.classList.add('active');

            // Update hidden input value
            const entityType = this.getAttribute('data-entity');
            entityTypeInput.value = entityType;
        });
    });


    // ===================================
    // File Upload Handling
    // ===================================

    const fileInput = document.getElementById('documents');
    const fileList = document.getElementById('file-list');

    fileInput.addEventListener('change', function () {
        const files = Array.from(this.files);

        if (files.length > 0) {
            fileList.innerHTML = '<strong>Vybrané soubory:</strong><br>' +
                files.map(file => `• ${file.name} (${formatFileSize(file.size)})`).join('<br>');
        } else {
            fileList.innerHTML = '';
        }
    });

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }


    // ===================================
    // Form Validation & Submission
    // ===================================

    const taxForm = document.getElementById('tax-form');

    taxForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(taxForm);
        const data = {};

        formData.forEach((value, key) => {
            if (key !== 'documents') {
                data[key] = value;
            }
        });

        // Add files info
        const files = Array.from(fileInput.files);
        data.documents = files.map(f => f.name);

        // Log form data (in production, this would be sent to server)
        console.log('Form submitted with data:', data);

        // Show success message
        showSuccessMessage();
    });

    function showSuccessMessage() {
        const formContainer = document.querySelector('.form-container');

        // Create success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            background: linear-gradient(135deg, var(--color-green-500), var(--color-green-600));
            color: white;
            padding: var(--space-8);
            border-radius: var(--radius-xl);
            text-align: center;
            margin-top: var(--space-6);
            animation: fadeInUp 0.5s ease-out;
        `;
        successDiv.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto var(--space-4);">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3 style="margin-bottom: var(--space-2); color: white;">Děkujeme za odeslání!</h3>
            <p style="margin: 0; color: white; opacity: 0.9;">Vaše údaje jsme přijali. Brzy vás budeme kontaktovat s dalšími informacemi.</p>
        `;

        // Hide form and show success message
        taxForm.style.display = 'none';
        formContainer.appendChild(successDiv);

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }


    // ===================================
    // Input Formatting
    // ===================================

    // Format IČO (8 digits)
    const icoInput = document.getElementById('ico');
    icoInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        e.target.value = value;
    });

    // Format PSČ (5 digits with space: XXX XX)
    const zipInput = document.getElementById('zip');
    zipInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) value = value.slice(0, 5);
        if (value.length > 3) {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        }
        e.target.value = value;
    });

    // Format phone number
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 9) value = value.slice(0, 9);

        // Format as +420 XXX XXX XXX
        if (value.length > 0) {
            let formatted = '+420 ';
            if (value.length <= 3) {
                formatted += value;
            } else if (value.length <= 6) {
                formatted += value.slice(0, 3) + ' ' + value.slice(3);
            } else {
                formatted += value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            }
            e.target.value = formatted;
        }
    });


    // ===================================
    // Add Micro-animations on Hover
    // ===================================

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

});
