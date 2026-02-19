// Blog Data Structure
const blogPosts = [
    {
        id: 1,
        title: "GTA 6: Complete Guide - Gameplay, Story, Platforms & Release Details",
        excerpt: "Comprehensive GTA 6 guide covering gameplay mechanics, dual protagonists Lucia and Jason, Miami Vice setting, next-gen graphics, platform specifications, system requirements, story details, and everything you need to know about Grand Theft Auto VI.",
        content: "Full content here...",
        category: "Gaming News",
        tags: ["GTA 6", "Grand Theft Auto", "Gaming", "Gameplay", "Story", "PS5", "Xbox Series X", "Open-World"],
        date: "2026-02-19",
        author: "Akku Electronics",
        image: "images/gta61.webp",
        link: "19022026gta6complete.html"
    },
    {
        id: 2,
        title: "PS5 DualSense Controller: Complete Hardware Revisions & Schematics Guide",
        excerpt: "Complete technical breakdown of all DualSense controller hardware revisions (BDM-010, 020, 030, 040). Pinout diagrams, trigger assembly schematics, PCB layouts, and comprehensive repair guide for technicians and modders.",
        content: "Full content here...",
        category: "Technical Guide",
        tags: ["DualSense", "PlayStation 5", "Hardware", "Schematics", "Repair Guide", "PCB"],
        date: "2026-01-14",
        author: "Akku Electronics",
        image: "images/ds_banner.webp",
        link: "14012026ps5-dsc-schematic.html"
    },
    {
        id: 3,
        title: "DualSense Controller: 15 Pro Tips & Tricks You Need to Know",
        excerpt: "Unlock the full potential of your PlayStation 5 DualSense controller. Discover 15 essential tips to enhance haptic feedback, improve battery life, and master advanced features.",
        content: "Full content here...",
        category: "Guide",
        tags: ["DualSense", "PlayStation 5", "Tips", "Controller", "Gaming"],
        date: "2026-01-12",
        author: "Akku Electronics",
        image: "images/ps5dsbanner1.webp",
        link: "12012026dualsense15tricks.html"
    },
    {
        id: 4,
        title: "PlayStation 5 Pro: Technical Deep Dive & Performance Analysis",
        excerpt: "Complete technical breakdown of the PS5 Pro featuring 67% GPU upgrade, advanced ray tracing, AI-powered PSSR upscaling, and comprehensive hardware specifications.",
        content: "Full content here...",
        category: "Hardware Review",
        tags: ["PS5 Pro", "PlayStation 5", "GPU", "Performance", "Hardware Analysis"],
        date: "2026-01-13",
        author: "Akku Electronics",
        image: "images/ps5-pro-review.jpg",
        link: "13012026ps5prospecs.html"
    },
    {
        id: 5,
        title: "Xbox Game Pass Ultimate in 2026: Is It Still Worth $17/Month?",
        excerpt: "Complete 2026 analysis of Xbox Game Pass Ultimate. 500+ games, day-one releases, cloud gaming, EA Play – is it worth $17/month? Full value breakdown, tips, and recommendations.",
        content: "Full content here...",
        category: "Value Analysis",
        tags: ["Xbox Game Pass", "Xbox", "Services", "Value Analysis", "Cloud Gaming"],
        date: "2026-01-13",
        author: "Akku Electronics",
        image: "images/xbox-gpu-banner-1.jpg",
        link: "13012026xboxgamepassultimate.html"
    },
    {
        id: 6,
        title: "PS4 Fan Noise: Causes, Solutions & Prevention",
        excerpt: "Comprehensive troubleshooting guide for PS4 fan issues. Discover causes, effective solutions, and maintenance tips to keep your console running quietly.",
        content: "Full content here...",
        category: "Troubleshooting",
        tags: ["PlayStation 4", "Fan Repair", "Maintenance", "Repair Guide"],
        date: "2026-01-05",
        author: "Akku Electronics",
        image: "../images/ps4fat/ps4fat_front.png",
        link: "#"
    },
    {
        id: 7,
        title: "Gaming Console News & Updates January 2026",
        excerpt: "Stay informed with the latest gaming industry announcements, console releases, software updates, and tech innovations for this month.",
        content: "Full content here...",
        category: "News",
        tags: ["News", "Gaming Updates", "Industry", "Console News"],
        date: "2026-01-03",
        author: "Akku Electronics",
        image: "../images/ps5slimdiscconsole/ps5slimdiscconsole_1.png",
        link: "#"
    },
    {
        id: 8,
        title: "PlayStation 3 HEN 4.92: Installation & Security Guide",
        excerpt: "Complete technical guide to PS3 HEN installation, setup process, security considerations, and how it compares to CFW alternatives.",
        content: "Full content here...",
        category: "Technical Guide",
        tags: ["PlayStation 3", "HEN", "Firmware", "Installation"],
        date: "2025-12-28",
        author: "Akku Electronics",
        image: "../images/ps3superslim/ps3superslim_front.png",
        link: "#"
    },
    {
        id: 9,
        title: "Xbox One Controller Connection Issues: Troubleshooting",
        excerpt: "Expert troubleshooting guide for Xbox One controller connectivity problems. Fix wireless, USB, and pairing issues with step-by-step solutions.",
        content: "Full content here...",
        category: "Troubleshooting",
        tags: ["Xbox One", "Controller", "Fix", "Connectivity"],
        date: "2025-12-25",
        author: "Akku Electronics",
        image: "../images/xbox360/xbox360controller.jpg",
        link: "#"
    },
    {
        id: 10,
        title: "Boost Console FPS: Performance Enhancement Techniques",
        excerpt: "Advanced strategies to increase frame rates on PlayStation and Xbox. Learn optimization methods, settings adjustments, and performance monitoring techniques.",
        content: "Full content here...",
        category: "Optimization",
        tags: ["Performance", "FPS", "Settings", "Gaming Tips"],
        date: "2025-12-20",
        author: "Akku Electronics",
        image: "../images/ps5slimdiscconsole/ps5slimdiscconsole_2.png",
        link: "#"
    },
    {
        id: 11,
        title: "PlayStation Network Security: Protect Your Account",
        excerpt: "Essential PSN security guide covering password protection, two-factor authentication, account recovery, and cyber threat prevention strategies.",
        content: "Full content here...",
        category: "Security",
        tags: ["Security", "PSN", "Account Protection", "Best Practices"],
        date: "2025-12-15",
        author: "Akku Electronics",
        image: "../images/ps5slimdiscconsole/ps5slimdiscconsole_3.png",
        link: "#"
    },
    {
        id: 12,
        title: "Xbox Game Pass Ultimate: Maximizing Your Subscription",
        excerpt: "Complete guide to Xbox Game Pass Ultimate benefits, hidden features, game library navigation, and how to get maximum value from your subscription.",
        content: "Full content here...",
        category: "Guide",
        tags: ["Xbox", "Game Pass", "Subscription", "Entertainment"],
        date: "2025-12-10",
        author: "Akku Electronics",
        image: "../images/xbox series x console.png",
        link: "#"
    }
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const blogPostsGrid = document.getElementById('blogPostsGrid');
const noResults = document.getElementById('noResults');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const filterToggle = document.getElementById('filterToggle');
const categoriesWidget = document.getElementById('categoriesWidget');
const tagsWidget = document.getElementById('tagsWidget');
const dateWidget = document.getElementById('dateWidget');
const categoryFilters = document.querySelectorAll('.category-filter');
const dateFilters = document.querySelectorAll('input[name="dateRange"]');
const tagsContainer = document.getElementById('tagsContainer');
const recentPostsList = document.getElementById('recentPostsList');

// State Variables
let filteredPosts = [...blogPosts];
let postsPerPage = 6;
let currentPage = 1;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    populateTags();
    populateRecentPosts();
    displayBlogPosts();
    setupEventListeners();
});

// Populate Tags
function populateTags() {
    const allTags = new Set();
    blogPosts.forEach(post => {
        post.tags.forEach(tag => allTags.add(tag));
    });

    const tagsHTML = Array.from(allTags)
        .sort()
        .map(tag => `<button class="tag-btn" data-tag="${tag}">${tag}</button>`)
        .join('');
    
    tagsContainer.innerHTML = tagsHTML;

    // Add click event to tag buttons
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterByTag(this.getAttribute('data-tag'));
        });
    });
}

// Populate Recent Posts
function populateRecentPosts() {
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    const recentHTML = sortedPosts
        .map(post => `
            <li>
                <a href="${post.link}">${post.title}</a>
                <span class="post-date">${formatDate(post.date)}</span>
            </li>
        `)
        .join('');
    
    recentPostsList.innerHTML = recentHTML;
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', function() {
        clearSearch.style.display = this.value ? 'block' : 'none';
        filterPosts();
    });

    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        filterPosts();
    });

    // Category Filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            handleCategoryFilter();
        });
    });

    // Date Filters
    dateFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            filterPosts();
        });
    });

    // Filter Toggle (Mobile)
    filterToggle.addEventListener('click', function() {
        categoriesWidget.classList.toggle('active');
        tagsWidget.classList.toggle('active');
        dateWidget.classList.toggle('active');
        this.classList.toggle('expanded');
        this.querySelector('span').textContent = categoriesWidget.classList.contains('active') ? 'Hide Filters' : 'Show Filters';
    });

    // Load More
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        displayBlogPosts(true);
    });
}

// Handle Category Filter
function handleCategoryFilter() {
    const selectedCategories = Array.from(categoryFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);

    if (selectedCategories.includes('all')) {
        filteredPosts = [...blogPosts];
    } else {
        filteredPosts = blogPosts.filter(post => selectedCategories.includes(post.category));
    }

    currentPage = 1;
    filterPosts();
}

// Filter by Tag
function filterByTag(tag) {
    const tagBtns = document.querySelectorAll('.tag-btn');
    const allTagBtns = document.querySelectorAll(`.tag-btn[data-tag="${tag}"]`);
    
    // Toggle active state
    allTagBtns.forEach(btn => btn.classList.toggle('active'));

    // Get all active tags
    const activeTags = Array.from(document.querySelectorAll('.tag-btn.active')).map(btn => btn.getAttribute('data-tag'));

    if (activeTags.length === 0) {
        filteredPosts = [...blogPosts];
    } else {
        filteredPosts = blogPosts.filter(post => 
            activeTags.some(activeTag => post.tags.includes(activeTag))
        );
    }

    currentPage = 1;
    filterPosts();
}

// Filter Posts
function filterPosts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedDateRange = document.querySelector('input[name="dateRange"]:checked').value;
    const selectedCategories = Array.from(categoryFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    const activeTags = Array.from(document.querySelectorAll('.tag-btn.active')).map(btn => btn.getAttribute('data-tag'));

    let results = blogPosts.filter(post => {
        // Search filter
        const matchesSearch = !searchTerm || 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        // Category filter
        const matchesCategory = selectedCategories.includes('all') || selectedCategories.includes(post.category);

        // Tag filter
        const matchesTags = activeTags.length === 0 || activeTags.some(tag => post.tags.includes(tag));

        // Date range filter
        const postDate = new Date(post.date);
        const today = new Date();
        let matchesDateRange = true;

        switch(selectedDateRange) {
            case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDateRange = postDate >= weekAgo;
                break;
            case 'month':
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                matchesDateRange = postDate >= monthAgo;
                break;
            case 'year':
                const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
                matchesDateRange = postDate >= yearAgo;
                break;
        }

        return matchesSearch && matchesCategory && matchesTags && matchesDateRange;
    });

    filteredPosts = results.sort((a, b) => new Date(b.date) - new Date(a.date));
    currentPage = 1;
    displayBlogPosts();
}

// Display Blog Posts
function displayBlogPosts(append = false) {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToDisplay = filteredPosts.slice(startIndex, endIndex);

    if (postsToDisplay.length === 0 && !append) {
        blogPostsGrid.innerHTML = '';
        noResults.style.display = 'block';
        loadMoreContainer.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';

    const postsHTML = postsToDisplay
        .map(post => createPostCard(post))
        .join('');

    if (append) {
        blogPostsGrid.innerHTML += postsHTML;
    } else {
        blogPostsGrid.innerHTML = postsHTML;
    }

    // Show load more button if there are more posts
    if (endIndex < filteredPosts.length) {
        loadMoreContainer.style.display = 'block';
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

// Create Post Card HTML
function createPostCard(post) {
    const tagsHTML = post.tags
        .slice(0, 3)
        .map(tag => `<span class="post-tag">${tag}</span>`)
        .join('');

    return `
        <article class="blog-post-card">
            <a href="${post.link}" class="blog-post-image-link">
                <div class="blog-post-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='../images/aelogo.png'">
                </div>
            </a>
            <div class="blog-post-content">
                <div class="blog-post-meta">
                    <span class="post-date-meta">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(post.date)}
                    </span>
                    <span class="post-category">${post.category}</span>
                </div>
                <h3 class="blog-post-title">${post.title}</h3>
                <p class="blog-post-excerpt">${post.excerpt}</p>
                <div class="post-tags">
                    ${tagsHTML}
                </div>
                <a href="${post.link}" class="read-more-link">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}

// Mobile Responsive Adjustments
function adjustForMobile() {
    if (window.innerWidth <= 768) {
        postsPerPage = 4;
    } else if (window.innerWidth <= 1024) {
        postsPerPage = 5;
    } else {
        postsPerPage = 6;
    }
}

window.addEventListener('resize', function() {
    adjustForMobile();
    currentPage = 1;
    displayBlogPosts();
});

adjustForMobile();
