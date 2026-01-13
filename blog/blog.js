// Blog Data Structure
const blogPosts = [
    {
        id: 1,
        title: "DualSense 15 Pro Tips & Tricks",
        excerpt: "Master your PlayStation 5 controller with these 15 essential tips and tricks that will enhance your gaming experience.",
        content: "Full content here...",
        category: "PlayStation",
        tags: ["DualSense", "PlayStation 5", "Tips", "Controller"],
        date: "2026-01-12",
        author: "Akku Electronics",
        image: "images/ps5dsbanner1.webp",
        link: "12012026dualsense15tricks.html"
    },
    {
        id: 2,
        title: "The PlayStation 5 Pro: A Technical Deep Dive into Sony's Mid-Gen Powerhouse",
        excerpt: "Explore the PS5 Pro's 67% GPU upgrade, advanced ray tracing, AI-powered PSSR upscaling, and complete technical specifications.",
        content: "Full content here...",
        category: "PlayStation",
        tags: ["PS5 Pro", "PlayStation 5", "GPU", "Technical Analysis", "Gaming Hardware"],
        date: "2026-01-13",
        author: "Akku Electronics",
        image: "images/ps5-pro-review.jpg",
        link: "13012026ps5prospecs.html"
    },
    {
        id: 3,
        title: "Xbox Series X Performance Boost Guide",
        excerpt: "Optimize your Xbox Series X for maximum performance with these hardware and software optimization tips.",
        content: "Full content here...",
        category: "gaming",
        tags: ["Xbox Series X", "Optimization", "Performance"],
        date: "2026-01-08",
        author: "Akku Electronics",
        image: "../images/xboxseriesbanner1.jpg",
        link: "#"
    },
    {
        id: 4,
        title: "PlayStation 4 Fan Noise: Causes & Fixes",
        excerpt: "Why is your PS4 fan loud? Discover the main causes and effective solutions to reduce fan noise.",
        content: "Full content here...",
        category: "repair",
        tags: ["PlayStation 4", "Fan Repair", "Maintenance"],
        date: "2026-01-05",
        author: "Akku Electronics",
        image: "../images/ps4banner1.jpg",
        link: "#"
    },
    {
        id: 5,
        title: "Latest Gaming Console News January 2026",
        excerpt: "Stay updated with the latest announcements, releases, and news from the gaming world.",
        content: "Full content here...",
        category: "news",
        tags: ["News", "Gaming", "Updates"],
        date: "2026-01-03",
        author: "Akku Electronics",
        image: "../images/playstationbanner1.jpg",
        link: "#"
    },
    {
        id: 6,
        title: "Complete PS3 Jailbreak Guide 2026",
        excerpt: "A comprehensive guide on how to safely jailbreak your PlayStation 3 console with all necessary steps.",
        content: "Full content here...",
        category: "repair",
        tags: ["PlayStation 3", "Jailbreak", "HEN"],
        date: "2025-12-28",
        author: "Akku Electronics",
        image: "../images/ps3banner1.jpeg",
        link: "#"
    },
    {
        id: 7,
        title: "Xbox One Controller Troubleshooting",
        excerpt: "Fix connectivity and hardware issues with your Xbox One controller using our step-by-step guide.",
        content: "Full content here...",
        category: "repair",
        tags: ["Xbox One", "Controller", "Fix"],
        date: "2025-12-25",
        author: "Akku Electronics",
        image: "../images/xboxonebanner1.jpg",
        link: "#"
    },
    {
        id: 8,
        title: "Gaming Tips: Improve Your FPS Performance",
        excerpt: "Advanced techniques to boost your frame rates and improve overall gaming performance on consoles.",
        content: "Full content here...",
        category: "gaming",
        tags: ["Performance", "FPS", "Tips"],
        date: "2025-12-20",
        author: "Akku Electronics",
        image: "../images/ps5banner1.jpg",
        link: "#"
    },
    {
        id: 9,
        title: "PlayStation Network Security: Protect Your Account",
        excerpt: "Essential security tips to keep your PlayStation Network account safe and secure from cyber threats.",
        content: "Full content here...",
        category: "gaming",
        tags: ["Security", "PSN", "Account"],
        date: "2025-12-15",
        author: "Akku Electronics",
        image: "../images/ps5 2.jpg",
        link: "#"
    },
    {
        id: 10,
        title: "Xbox Game Pass Ultimate: Complete Guide",
        excerpt: "Everything you need to know about Xbox Game Pass Ultimate and how to get the most out of your subscription.",
        content: "Full content here...",
        category: "gaming",
        tags: ["Xbox", "Game Pass", "Guide"],
        date: "2025-12-10",
        author: "Akku Electronics",
        image: "../images/xboxbanner1.jpg",
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
