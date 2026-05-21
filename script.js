/**
 * IBBI Informational Website - Interactive Controller
 * Pure Vanilla JavaScript ES6+
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- GLOBAL DOM SELECTORS & STATE ---
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const allLinks = document.querySelectorAll('a[href^="#"]');
    const navSections = document.querySelectorAll('section, main > section');
    const scrollThreshold = 50;

    // --- FUNCTIONS ---
    
    // Scroll event handler for sticky header and link highlighting
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
        
        highlightNavOnScroll();
    }

    // Active nav link highlighter based on scroll position
    function highlightNavOnScroll() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset for triggers

        navSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // --- EVENT ATTACHMENTS & LOGIC ---

    // 1. Sticky Header scroll listener
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initial check on load

    // 2. Mobile hamburger menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            
            // Adjust body overflow to prevent background scrolling when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close drawer when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Doctrinal Statement Accordions
    accordionItems.forEach(item => {
        const headerBtn = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        // Set initial heights for active elements
        if (item.classList.contains('active') && content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }

        if (headerBtn) {
            headerBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.accordion-header');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                    if (otherContent) otherContent.style.maxHeight = null;
                });

                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                    headerBtn.setAttribute('aria-expanded', 'true');
                    if (content) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                }
            });
        }
    });

    // Handle window resize to recalculate accordion active panel heights if text wraps
    window.addEventListener('resize', () => {
        accordionItems.forEach(item => {
            if (item.classList.contains('active')) {
                const content = item.querySelector('.accordion-content');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // 4. Academic Curriculum Tab Switcher
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');

            // Remove active states from buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            // Remove active states from panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Activate current button & panel
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            const targetPanel = document.getElementById(targetTabId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // 5. Smooth scrolling with offset for sticky header
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get header height dynamically depending on viewport/shrink state
                const headerOffset = header.classList.contains('shrink') ? 72 : 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. INTERSECTION OBSERVER FOR HEADER BRAND VISIBILITY
    const brandLogoLink = document.querySelector('.brand-logo');
    const heroBrandBlock = document.querySelector('.hero-brand-block');

    if (brandLogoLink && heroBrandBlock) {
        const observerOptions = {
            root: null,
            threshold: 0.05
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    brandLogoLink.classList.add('brand-hidden');
                } else {
                    brandLogoLink.classList.remove('brand-hidden');
                }
            });
        }, observerOptions);

        observer.observe(heroBrandBlock);
    }

    // 7. ONLINE ENROLLMENT PORTAL MODAL
    const enrollOnlineLink = document.getElementById('enroll-online-link');
    const enrollmentModal = document.getElementById('enrollment-modal');
    const modalClose = document.getElementById('modal-close');
    const enrollmentForm = document.getElementById('online-enrollment-form');

    if (enrollOnlineLink && enrollmentModal) {
        const originalModalHTML = enrollmentModal.querySelector('.modal-card').innerHTML;

        const openModal = (e) => {
            e.preventDefault();
            enrollmentModal.classList.add('open');
            enrollmentModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            enrollmentModal.classList.remove('open');
            enrollmentModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        enrollOnlineLink.addEventListener('click', openModal);

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        enrollmentModal.addEventListener('click', (e) => {
            if (e.target === enrollmentModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && enrollmentModal.classList.contains('open')) {
                closeModal();
            }
        });

        const handleFormSubmit = (e) => {
            e.preventDefault();
            
            const modalBody = enrollmentModal.querySelector('.modal-card');
            const studentName = document.getElementById('student-name').value;
            
            modalBody.innerHTML = `
                <button class="modal-close-btn" id="modal-success-close" aria-label="Close Modal">&times;</button>
                <div style="text-align: center; padding: 2rem 0;">
                    <span style="font-size: 4rem; color: var(--accent-gold); display: block; margin-bottom: 1.5rem;">✓</span>
                    <h3 class="modal-title" style="margin-bottom: 0.5rem;">Initial Enrollment Submitted!</h3>
                    <p class="modal-subtitle" style="margin-bottom: 2rem; max-width: 420px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                        Thank you, <strong>${studentName}</strong>. Your details have been successfully recorded. Ptr. Rodel A. Cuyo or the registrar office will contact you shortly to complete the admissions process.
                    </p>
                    <button class="btn btn-primary" id="modal-success-done" style="min-width: 150px;">Done</button>
                </div>
            `;
            
            const successClose = document.getElementById('modal-success-close');
            const successDone = document.getElementById('modal-success-done');
            
            const closeSuccess = () => {
                closeModal();
                setTimeout(() => {
                    modalBody.innerHTML = originalModalHTML;
                    // Rebind events to fresh DOM elements
                    const newClose = document.getElementById('modal-close');
                    if (newClose) newClose.addEventListener('click', closeModal);
                    const newForm = document.getElementById('online-enrollment-form');
                    if (newForm) newForm.addEventListener('submit', handleFormSubmit);
                }, 400);
            };
            
            if (successClose) successClose.addEventListener('click', closeSuccess);
            if (successDone) successDone.addEventListener('click', closeSuccess);
        };

        if (enrollmentForm) {
            enrollmentForm.addEventListener('submit', handleFormSubmit);
        }
    }

});
