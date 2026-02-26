// Burger menu toggle
(function () {
    const burger = document.getElementById('nav-burger-btn');
    const nav = document.querySelector('.navbar');
    const navMenu = document.getElementById('nav-menu');

    if (!burger || !nav || !navMenu) return;

    function openMenu() {
        nav.classList.add('nav-open');
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', 'Close menu');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        nav.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', function () {
        if (nav.classList.contains('nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close when clicking a nav link (e.g. smooth scroll or page change)
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
            closeMenu();
        }
    });

    // Close when clicking outside the menu (on backdrop)
    document.addEventListener('click', function (e) {
        if (nav.classList.contains('nav-open') && !nav.contains(e.target)) {
            closeMenu();
        }
    });

    // Reset menu on resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 968) {
            closeMenu();
        }
    });
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip download buttons (handled separately) and empty anchors
        if (href === '#' || this.classList.contains('download-btn')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // If target doesn't exist (like #privacy, #faq, etc.), show message
            console.log(`Section ${href} is not available yet`);
        }
    });
});

// Add scroll animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature items and steps
document.querySelectorAll('.feature-item, .step, .screenshot-item').forEach(item => {
    // Only set initial styles if not already animated by CSS
    if (!item.style.opacity) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    observer.observe(item);
});

// Start game function
function startGame() {
    const overlay = document.getElementById('play-overlay');
    const frame = document.getElementById('game-frame');
    
    if (overlay) {
        overlay.classList.add('hidden');
    }
    
    // Reload iframe to ensure fresh start
    if (frame) {
        frame.src = frame.src;
    }
}

// Simple form handling for waitlist (if you add one)
// You can integrate with a service like Mailchimp, ConvertKit, or Firebase
// App is now available on the App Store!

// Add subtle parallax effect to hero (only if not conflicting with CSS animations)
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight && scrolled !== lastScrollTop) {
        // Only apply parallax to background, not the entire hero container
        const patternOverlay = hero.querySelector('.pattern-overlay');
        if (patternOverlay) {
            patternOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        lastScrollTop = scrolled;
    }
});

// Category information data
const categoryData = {
    'prophets': {
        name: 'Prophets (with English names)',
        description: 'Popular prophets from Islamic tradition, including their English names for easy recognition.',
        words: ['Muhammad ﷺ', 'Ibrahim (Abraham)', 'Musa (Moses)', 'Isa (Jesus)', 'Nuh (Noah)', 'Adam', 'Yusuf (Joseph)', 'Sulaiman (Solomon)', 'Dawud (David)', 'Yunus (Jonah)', 'Yahya (John)', 'Zakariyya (Zechariah)', 'Ismail (Ishmael)', 'Ayyub (Job)']
    },
    'seerah': {
        name: 'Seerah Events',
        description: 'Important moments and events from the life of Prophet Muhammad (SAW).',
        words: ['Hijrah', 'Battle of Badr', 'Battle of Uhud', 'Conquest of Makkah', 'Night Journey (Isra & Mi\'raj)', 'First Revelation', 'Treaty of Hudaybiyyah', 'Migration to Madinah', 'Breaking of the Idols']
    },
    'ramadan': {
        name: 'Ramadan Terms',
        description: 'Terms and practices related to the holy month of Ramadan.',
        words: ['Iftar', 'Suhoor', 'Taraweeh', 'Fasting', 'Quran', 'Charity', 'Prayer', 'Dates', 'Laylatul Qadr', 'Eid', 'Dhikr', 'Dua', 'Zakat', 'Sadaqah']
    },
    'worship': {
        name: 'Worship & Prayer',
        description: 'Daily worship and prayer practices in Islam.',
        words: ['Salah', 'Wudu', 'Adhan', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Qibla', 'Prayer Rug', 'Imam', 'Jummah', 'Khutbah', 'Dua', 'Dhikr', 'Tasbih', 'Sajdah', 'Ruku']
    },
    'halal-foods': {
        name: 'Halal Foods',
        description: 'Foods that are permissible to eat according to Islamic dietary laws.',
        words: ['Halal', 'Dates', 'Olives', 'Honey', 'Lamb', 'Chicken', 'Fish', 'Rice', 'Bread', 'Yogurt', 'Milk', 'Fruits', 'Vegetables', 'Nuts', 'Zabiha']
    },
    'masjid': {
        name: 'Masjid Life',
        description: 'Terms and concepts related to mosque life and community.',
        words: ['Mosque', 'Prayer Hall', 'Qibla', 'Prayer Rug', 'Quran Stand', 'Imam', 'Jummah', 'Khutbah', 'Adhan', 'Iqamah', 'Wudu', 'Ablution', 'Community', 'Classes']
    },
    'values': {
        name: 'Islamic Values',
        description: 'Core values and virtues in Islam.',
        words: ['Kindness', 'Patience', 'Gratitude', 'Humility', 'Forgiveness', 'Honesty', 'Generosity', 'Modesty', 'Respect', 'Justice', 'Mercy', 'Compassion', 'Brotherhood', 'Sisterhood', 'Trust', 'Loyalty', 'Wisdom', 'Bravery']
    },
    'basic-terms': {
        name: 'Basic Islamic Terms',
        description: 'Fundamental terms every Muslim should know.',
        words: ['Allah', 'Deen', 'Iman', 'Halal', 'Haram', 'Sunnah', 'Hadith', 'Quran', 'Muslim', 'Islam', 'Prophet', 'Mosque', 'Prayer', 'Fasting', 'Charity', 'Hajj', 'Umrah', 'Shahadah']
    },
    'history': {
        name: 'Islamic History',
        description: 'Important events and periods in Islamic history.',
        words: ['Conquest of Jerusalem', 'Battle of Yarmouk', 'Fall of Constantinople', 'Golden Age of Baghdad', 'Al-Andalus', 'Crusades', 'Building of Al-Azhar', 'First Hijrah to Abyssinia', 'Mongol Invasion', 'Reconquista', 'Ottoman Empire Rise', 'Salahuddin Ayyubi']
    },
    'months': {
        name: 'Islamic Months & Holidays',
        description: 'The Islamic calendar months and important holidays.',
        words: ['Ramadan', 'Dhul Hijjah', 'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaaban', 'Shawwal', 'Dhul Qidah', 'Eid al-Fitr', 'Eid al-Adha', 'Laylatul Qadr', 'Mawlid', 'Ashura', 'Hajj']
    },
    'quran': {
        name: 'Quran Concepts',
        description: 'Important concepts and surahs from the Quran.',
        words: ['Surah Al-Fatiha', 'Surah Al-Baqarah', 'Surah Al-Ikhlas', 'Surah Yasin', 'Ayatul Kursi', 'Paradise (Jannah)', 'Hellfire (Jahannam)', 'Angels', 'Jinn', 'Day of Judgment', 'Resurrection', 'Qiyamah', 'Akhirah', 'Dunya', 'Tawheed', 'Shirk', 'Kufr']
    },
    'marriage': {
        name: 'Marriage & Nikah',
        description: 'Terms and concepts related to Islamic marriage.',
        words: ['Nikah', 'Wedding', 'Mahr', 'Dowry', 'Wali', 'Qadi', 'Contract', 'Ceremony', 'Walima', 'Reception', 'Bride', 'Groom', 'Henna', 'Engagement', 'Proposal', 'Spouse', 'Vows', 'Blessing']
    },
    'charity': {
        name: 'Charity & Zakat',
        description: 'Concepts of giving and charity in Islam.',
        words: ['Zakat', 'Sadaqah', 'Charity', 'Giving', 'Orphans', 'Needy', 'Donation', 'Generosity', 'Sharing', 'Feeding', 'Community', 'Education', 'Medical', 'Relief', 'Helping']
    },
    'hajj': {
        name: 'Hajj & Umrah',
        description: 'Terms related to the pilgrimage to Makkah.',
        words: ['Hajj', 'Umrah', 'Makkah', 'Madinah', 'Kaaba', 'Tawaf', 'Sai', 'Arafat', 'Muzdalifah', 'Mina', 'Jamarat', 'Ihram', 'Talbiyah', 'Black Stone', 'Zamzam Water', 'Mount Safa', 'Mount Marwah', 'Pilgrimage']
    },
    'clothing': {
        name: 'Islamic Clothing',
        description: 'Modest clothing worn by Muslims.',
        words: ['Hijab', 'Niqab', 'Abaya', 'Thobe', 'Kufi', 'Taqiyah', 'Modest', 'Covering', 'Jilbab', 'Khimar', 'Turban', 'Scarf', 'Cap']
    },
    'companions': {
        name: 'Companions of Prophet',
        description: 'The Sahabah - companions of Prophet Muhammad (SAW).',
        words: ['Abu Bakr', 'Umar', 'Uthman', 'Ali', 'Khadija', 'Aisha', 'Fatima', 'Bilal', 'Hamza', 'Zayd', 'Umm Aiman', 'Zainab', 'Hassan', 'Hussein', 'Anas', 'Abdullah ibn Abbas', 'Abu Hurairah', 'Sahabah']
    },
    'architecture': {
        name: 'Islamic Architecture',
        description: 'Famous Islamic architectural sites and structures.',
        words: ['Kaaba', 'Masjid Nabawi', 'Masjid Al-Aqsa', 'Dome of the Rock', 'Al-Azhar', 'Cordoba Mosque', 'Blue Mosque', 'Medina', 'Makkah', 'Jerusalem', 'Istanbul', 'Baghdad', 'Damascus', 'Cairo', 'Andalusia', 'Taj Mahal', 'Alhambra', 'Topkapi']
    },
    'scholars': {
        name: 'Islamic Scholars & Imams',
        description: 'Renowned Islamic scholars and imams throughout history.',
        words: ['Imam Malik', 'Imam Shafi', 'Imam Hanbal', 'Imam Abu Hanifa', 'Imam Bukhari', 'Imam Muslim', 'Imam Tirmidhi', 'Ibn Sina', 'Al-Ghazali', 'Ibn Rushd', 'Ibn Taymiyyah', 'Ibn Kathir', 'Al-Tabari', 'Ibn Hajar', 'Al-Nawawi', 'Ibn Qayyim']
    },
    'duas': {
        name: 'Duas & Supplications',
        description: 'Various supplications and prayers for different occasions.',
        words: ['Travel Dua', 'Eating Dua', 'Sleeping Dua', 'Waking Dua', 'Leaving Dua', 'Entering Dua', 'Rain Dua', 'Protection Dua', 'Forgiveness Dua', 'Guidance Dua', 'Patience Dua', 'Health Dua', 'Success Dua', 'Parents Dua', 'Children Dua', 'Marriage Dua', 'Deceased Dua', 'Relief Dua']
    },
    'etiquette': {
        name: 'Islamic Etiquette (Adab)',
        description: 'Proper manners and etiquette in Islam.',
        words: ['Greeting (Salam)', 'Visiting', 'Eating', 'Speaking', 'Dressing', 'Entering', 'Leaving', 'Sneezing', 'Yawning', 'Bathroom', 'Cleanliness', 'Respect', 'Kindness', 'Hospitality', 'Modesty', 'Humility', 'Patience', 'Gratitude']
    },
    'countries': {
        name: 'Islamic Countries & Cities',
        description: 'Countries and cities with significant Muslim populations.',
        words: ['Saudi Arabia', 'Turkey', 'Egypt', 'Pakistan', 'Indonesia', 'Malaysia', 'Morocco', 'Algeria', 'Tunisia', 'Iraq', 'Iran', 'Afghanistan', 'Bangladesh', 'UAE', 'Qatar', 'Kuwait', 'Oman', 'Yemen']
    },
    'msa': {
        name: 'MSA',
        description: 'Muslim Student Association - terms and concepts related to campus Muslim life.',
        words: ['MSA', 'Halaqa', 'Jummah', 'Eid Prayer', 'Ramadan Iftar', 'Islamic Week', 'Dawah', 'Community', 'Campus', 'Student', 'Brotherhood', 'Sisterhood']
    },
    'more': {
        name: 'And Many More!',
        description: 'Khafī includes many more categories to explore. Download the app to discover all available categories and create your own custom categories!',
        words: ['Custom Categories', 'Location-Based', 'Personal Lists', 'Family Traditions', 'And More!']
    }
};

// Category modal functionality
const categoryModal = document.getElementById('category-modal');
const categoryModalTitle = document.getElementById('category-modal-title');
const categoryModalDescription = document.getElementById('category-modal-description');
const categoryModalWordsList = document.getElementById('category-modal-words-list');
const categoryModalClose = document.querySelector('.category-modal-close');

// Open modal when category is clicked
document.querySelectorAll('.category-tag').forEach(tag => {
    tag.addEventListener('click', function() {
        const categoryId = this.getAttribute('data-category');
        const category = categoryData[categoryId];
        
        if (category) {
            categoryModalTitle.textContent = category.name;
            categoryModalDescription.textContent = category.description;
            
            // Clear and populate words
            categoryModalWordsList.innerHTML = '';
            category.words.forEach(word => {
                const wordTag = document.createElement('div');
                wordTag.className = 'category-word-tag';
                wordTag.textContent = word;
                categoryModalWordsList.appendChild(wordTag);
            });
            
            categoryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Add cursor pointer
    tag.style.cursor = 'pointer';
});

// Close modal
categoryModalClose.addEventListener('click', () => {
    categoryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
categoryModal.addEventListener('click', (e) => {
    if (e.target === categoryModal) {
        categoryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && categoryModal.style.display === 'flex') {
        categoryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Feedback form handling with Formspree
const feedbackForm = document.getElementById('feedback-form');
const feedbackSuccess = document.getElementById('feedback-success');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                this.style.display = 'none';
                feedbackSuccess.style.display = 'block';
                
                // Reset form
                this.reset();
                
                // Scroll to success message
                feedbackSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Sorry, there was an error submitting your feedback. Please try again later.');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Updates carousel: click or swipe on content to change slides (no arrows or dots)
(function () {
    const carousel = document.getElementById('updates-carousel');
    if (!carousel) return;

    const viewport = carousel.querySelector('.updates-carousel-viewport');
    const track = carousel.querySelector('.updates-carousel-track');
    const slides = carousel.querySelectorAll('.updates-carousel-slide');
    const total = slides.length;

    let index = 0;

    function goTo(i) {
        index = Math.max(0, Math.min(i, total - 1));
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
    }

    // Click anywhere on carousel: left half = previous, right half = next (ignore clicks on links)
    carousel.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        const rect = carousel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) {
            goTo(index - 1);
        } else {
            goTo(index + 1);
        }
    });

    // Swipe: touch left/right to change slide
    let touchStartX = 0;
    viewport.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo(index + 1);
            else goTo(index - 1);
        }
    }, { passive: true });

    carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    goTo(0);
})();
