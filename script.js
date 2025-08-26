// Cache configuration
const CACHE_KEY_PREFIX = 'aoyn1xw_github_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache utility functions
function getCachedData(key) {
    try {
        const cached = localStorage.getItem(CACHE_KEY_PREFIX + key);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < CACHE_DURATION) {
                console.log('Using cached data for:', key);
                return data.value;
            }
            // Remove expired cache
            localStorage.removeItem(CACHE_KEY_PREFIX + key);
        }
    } catch (error) {
        console.warn('Cache read error:', error);
    }
    return null;
}

function setCachedData(key, value) {
    try {
        const data = {
            value: value,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(data));
    } catch (error) {
        console.warn('Cache write error:', error);
        // Clear old cache if storage is full
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_KEY_PREFIX)) {
                localStorage.removeItem(key);
                break;
            }
        }
    }
}

// GitHub API configuration
const GITHUB_USERNAME = 'aoyn1xw';
const GITHUB_API_BASE = 'https://api.github.com';

// Language colors (GitHub's official colors)
const languageColors = {
    'JavaScript': '#f1e05a',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Python': '#3572A5',
    'TypeScript': '#2b7489',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'Vue': '#2c3e50',
    'React': '#61DAFB',
    'Shell': '#89e051',
    'Dockerfile': '#384d54'
};

// Language icons mapping
const languageIcons = {
    'JavaScript': '⚡',
    'HTML': '🌐',
    'CSS': '🎨',
    'Python': '🐍',
    'TypeScript': '📘',
    'Java': '☕',
    'C++': '⚙️',
    'C': '🔧',
    'PHP': '🐘',
    'Ruby': '💎',
    'Go': '🐹',
    'Rust': '🦀',
    'Swift': '🍎',
    'Kotlin': '📱',
    'Dart': '🎯',
    'Vue': '💚',
    'React': '⚛️',
    'Shell': '🐚',
    'Dockerfile': '🐳',
    'default': '💻'
};

// Manual languages configuration (user-controlled)
function displayManualLanguages() {
    // Static language data with manual control
    const manualLanguages = [
        { name: 'JavaScript', percentage: '40.0', proficiency: 'Advanced' },
        { name: 'HTML', percentage: '35.0', proficiency: 'Expert' },
        { name: 'CSS', percentage: '30.0', proficiency: 'Advanced' },
        { name: 'Python', percentage: '25.0', proficiency: 'Intermediate' },
        { name: 'TypeScript', percentage: '20.0', proficiency: 'Intermediate' },
        { name: 'React', percentage: '15.0', proficiency: 'Beginner' }
    ];

    const languagesGrid = document.getElementById('languages-grid');
    if (!languagesGrid) return;
    
    languagesGrid.classList.remove('loading');
    
    const languagesHTML = manualLanguages.map((lang, index) => {
        const icon = languageIcons[lang.name] || languageIcons.default;
        const color = languageColors[lang.name] || '#858585';
        
        return `
            <div class="language-item" style="animation-delay: ${index * 0.1}s;">
                <div class="language-icon">${icon}</div>
                <div class="language-info">
                    <span class="language-name">${lang.name}</span>
                    <div class="language-proficiency">${lang.proficiency}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" 
                             style="width: 0%; background: ${color}; --target-width: ${lang.percentage}%;"
                             data-percentage="${lang.percentage}">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    languagesGrid.innerHTML = languagesHTML;
    
    // Trigger progress animations
    setTimeout(() => {
        const progressBars = languagesGrid.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.getAttribute('data-percentage');
                bar.style.width = `${targetWidth}%`;
            }, index * 200);
        });
    }, 300);
}

// Legacy function kept for compatibility (now calls manual function)
async function fetchGitHubLanguages() {
    try {
        displayManualLanguages();
    } catch (error) {
        console.error('Error displaying languages:', error);
        const languagesGrid = document.getElementById('languages-grid');
        if (languagesGrid) {
            languagesGrid.innerHTML = `
                <div class="language-item">
                    <div class="language-icon">❌</div>
                    <div class="language-info">
                        <span class="language-name">Unable to load language data</span>
                    </div>
                </div>
            `;
        }
    }
}

// Fetch GitHub repositories
async function fetchGitHubRepos() {
    // Check cache first
    const cached = getCachedData('repos');
    if (cached) {
        updateReposUI(cached);
        return;
    }

    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const repos = await response.json();

        // Cache the response
        setCachedData('repos', repos);
        
        updateReposUI(repos);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        const reposGrid = document.getElementById('github-repos');
        if (reposGrid) {
            reposGrid.innerHTML = `
                <div class="repo-card">
                    <p style="color: var(--text-secondary); text-align: center;">
                        Unable to load repositories. Visit my 
                        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">GitHub profile</a> directly.
                    </p>
                </div>
            `;
        }
    }
}

function updateReposUI(repos) {
    const reposGrid = document.getElementById('github-repos');
    if (!reposGrid) return;

    reposGrid.innerHTML = repos.map((repo, index) => `
        <div class="repo-card" style="animation-delay: ${index * 0.1}s;">
            <div class="repo-header">
                <h4 class="repo-name">${repo.name}</h4>
                <span class="repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
            </div>
            <p class="repo-description">${repo.description || 'No description available'}</p>
            <div class="repo-stats">
                <span class="repo-language">
                    <span class="language-dot" style="background-color: ${languageColors[repo.language] || '#858585'}"></span>
                    ${repo.language || 'Unknown'}
                </span>
                <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                <span class="repo-forks">🍴 ${repo.forks_count}</span>
            </div>
            <div class="repo-footer">
                <span class="repo-updated">Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>
                <a href="${repo.html_url}" target="_blank" class="repo-link">View →</a>
            </div>
        </div>
    `).join('');
}

// Fetch GitHub profile data
async function fetchGitHubProfile() {
    // Check cache first
    const cached = getCachedData('profile');
    if (cached) {
        updateProfileUI(cached);
        return;
    }

    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
            mode: 'cors',
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const profile = await response.json();
        
        // Cache the response
        setCachedData('profile', profile);
        
        updateProfileUI(profile);
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        // Use fallback profile when API fails
        setFallbackProfile();
        const profileCard = document.getElementById('github-profile');
        if (profileCard) {
            profileCard.innerHTML = `
                <p style="color: var(--text-secondary); text-align: center;">
                    Unable to load GitHub profile. Visit my 
                    <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">GitHub page</a> directly.
                </p>
            `;
        }
    }
}

function updateProfileUI(profile) {
    // Update profile picture
    const profileImg = document.querySelector('.profile-pic img');
    if (profileImg && profile.avatar_url) {
        // Create a new image to preload
        const newImg = new Image();
        newImg.onload = function() {
            profileImg.src = profile.avatar_url;
            profileImg.alt = profile.name || profile.login;
            profileImg.classList.remove('loading-avatar');
        };
        newImg.onerror = function() {
            // If GitHub profile image fails, use a fallback
            setFallbackProfile();
        };
        newImg.src = profile.avatar_url;
    }
    
    const profileCard = document.getElementById('github-profile');
    if (profileCard) {
        profileCard.innerHTML = `
            <img src="${profile.avatar_url}" alt="${profile.name || profile.login}" class="github-avatar">
            <div class="github-info">
                <h4 class="github-name">${profile.name || profile.login}</h4>
                <p class="github-bio">${profile.bio || 'Frontend Developer & Student'}</p>
                <div class="github-stats">
                    <div class="github-stat">
                        <span class="github-stat-number">${profile.public_repos}</span>
                        <span class="github-stat-label">Repositories</span>
                    </div>
                    <div class="github-stat">
                        <span class="github-stat-number">${profile.followers}</span>
                        <span class="github-stat-label">Followers</span>
                    </div>
                    <div class="github-stat">
                        <span class="github-stat-number">${profile.following}</span>
                        <span class="github-stat-label">Following</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Fallback profile function
function setFallbackProfile() {
    console.log('Setting fallback profile');
    
    // Set fallback profile picture
    const profileImg = document.querySelector('.profile-pic img');
    if (profileImg) {
        // Use a fallback avatar (this should be a local image or a reliable CDN)
        profileImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjM2NkYxIiByeD0iMTAwIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYwIDEzMGMwLTIyIDEyLTQwIDQwLTQwczQwIDE4IDQwIDQwdjUwSDYwdi01MHoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
        profileImg.alt = 'Erdi Profile Picture';
        profileImg.classList.remove('loading-avatar');
    }
    
    // Set fallback profile card
    const profileCard = document.getElementById('github-profile');
    if (profileCard) {
        profileCard.innerHTML = `
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNjM2NkYxIiByeD0iNDAiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMiIgcj0iMTIiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNCA1MmMwLTkgNy0xNiAxNi0xNnMxNiA3IDE2IDE2djIwSDI0VjUyeiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" alt="Erdi" class="github-avatar">
            <div class="github-info">
                <h4 class="github-name">Erdi</h4>
                <p class="github-bio">Frontend Developer & Student from Germany</p>
                <div class="github-stats">
                    <div class="github-stat">
                        <span class="github-stat-number">10+</span>
                        <span class="github-stat-label">Repositories</span>
                    </div>
                    <div class="github-stat">
                        <span class="github-stat-number">5</span>
                        <span class="github-stat-label">Followers</span>
                    </div>
                    <div class="github-stat">
                        <span class="github-stat-number">3</span>
                        <span class="github-stat-label">Following</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Animated counter
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.repo-card, .language-item, .stat-card, .social-icon');
    animatableElements.forEach(el => observer.observe(el));
}

// Multilingual hello messages
const helloMessages = [
    { text: 'Hello! 👋', language: 'English' },
    { text: 'Hallo! 👋', language: 'German' },
    { text: 'Bonjour! 👋', language: 'French' },
    { text: 'Hola! 👋', language: 'Spanish' },
    { text: 'Ciao! 👋', language: 'Italian' },
    { text: 'こんにちは! 👋', language: 'Japanese' },
    { text: '안녕하세요! 👋', language: 'Korean' },
    { text: 'Привет! 👋', language: 'Russian' },
    { text: 'Olá! 👋', language: 'Portuguese' },
    { text: 'مرحبا! 👋', language: 'Arabic' },
    { text: 'Namaste! 👋', language: 'Hindi' },
    { text: 'Hej! 👋', language: 'Swedish' }
];

// Hello text cycling function
function cycleHelloText() {
    const helloElement = document.getElementById('hello-text');
    if (!helloElement) {
        console.error('Hello text element not found');
        return;
    }
    
    console.log('Hello text element found, starting animation');
    let currentIndex = 0;
    
    function changeText() {
        console.log('Changing text to:', helloMessages[(currentIndex + 1) % helloMessages.length].text);
        
        // Fade out using opacity
        helloElement.style.opacity = '0';
        helloElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            // Change text
            currentIndex = (currentIndex + 1) % helloMessages.length;
            helloElement.textContent = helloMessages[currentIndex].text;
            
            // Fade in
            helloElement.style.opacity = '1';
            helloElement.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Set initial transition and preserve gradient styling
    helloElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
    helloElement.style.background = 'linear-gradient(135deg, var(--primary), var(--accent))';
    helloElement.style.backgroundClip = 'text';
    helloElement.style.webkitBackgroundClip = 'text';
    helloElement.style.webkitTextFillColor = 'transparent';
    helloElement.style.color = 'transparent';
    
    // Test immediately after 3 seconds to make sure it's working
    setTimeout(() => {
        console.log('Testing hello text change');
        changeText();
    }, 3000);
    
    // Start cycling after initial delay
    setTimeout(() => {
        console.log('Starting hello text interval');
        setInterval(changeText, 3000); // Change every 3 seconds
    }, 1000); // Reduced initial delay to 1 second
}

// Fetch and display GitHub contribution graph
async function fetchGitHubContributions() {
    const contributionGraph = document.getElementById('contribution-graph');
    if (!contributionGraph) {
        console.log('Contribution graph element not found');
        return;
    }

    // Check cache first
    const cached = getCachedData('contributions');
    if (cached) {
        console.log('Using cached contribution data');
        displayContributionGraph(cached);
        return;
    }

    console.log('Fetching GitHub contributions...');

    try {
        // Reduced timeout from 8s to 3s
        const response = await Promise.race([
            fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=100`),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Contribution API timeout')), 3000)
            )
        ]);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const events = await response.json();
        console.log('GitHub events fetched:', events.length);
        
        // Cache the events data
        setCachedData('contributions', events);
        
        displayContributionGraph(events);
    } catch (error) {
        console.log('GitHub contributions fetch failed:', error.message);
        displayContributionFallback();
    }
}

// Generate contribution calendar from events data
function displayContributionGraph(events) {
    const contributionGraph = document.getElementById('contribution-graph');
    if (!contributionGraph) return;

    console.log('Displaying contribution graph with', events.length, 'events');

    // Process events to get contribution data
    const contributions = processContributionData(events);
    console.log('Processed contributions:', Object.keys(contributions).length, 'days with activity');
    
    const { calendar, stats } = generateContributionCalendar(contributions);
    console.log('Generated calendar with stats:', stats);

    contributionGraph.innerHTML = `
        <div class="contribution-calendar">
            <div class="contribution-header">
                <h4 class="contribution-title">Contribution Activity</h4>
                <div class="contribution-stats">
                    <div class="contribution-stat">
                        <span class="contribution-count">${stats.totalContributions}</span>
                        <span>contributions in the last year</span>
                    </div>
                    <div class="contribution-stat">
                        <span class="contribution-count">${stats.longestStreak}</span>
                        <span>day streak</span>
                    </div>
                </div>
            </div>
            
            <div class="calendar-grid">
                <div class="calendar-months">
                    ${generateMonthLabels()}
                </div>
                <div class="calendar-container">
                    <div class="calendar-main">
                        <div class="calendar-days">             
                            <div class="calendar-day-label">Mon</div>
                            <div class="calendar-day-label"></div>
                            <div class="calendar-day-label">Wed</div>
                            <div class="calendar-day-label"></div>
                            <div class="calendar-day-label">Fri</div>
                            <div class="calendar-day-label"></div>
                        </div>
                        <div class="calendar-weeks">
                            ${calendar}
                        </div>
                    </div>
                </div>
                
                <div class="calendar-legend">
                    <span class="legend-text">Less</span>
                    <div class="legend-levels">
                        <div class="legend-level" data-level="0"></div>
                        <div class="legend-level" data-level="1"></div>
                        <div class="legend-level" data-level="2"></div>
                        <div class="legend-level" data-level="3"></div>
                        <div class="legend-level" data-level="4"></div>
                    </div>
                    <span class="legend-text">More</span>
                </div>
            </div>
        </div>
        <div class="contribution-tooltip"></div>
    `;

    // Add hover functionality
    addContributionHoverEffects();
    console.log('Contribution graph displayed successfully');
}

// Process GitHub events to extract contribution data
function processContributionData(events) {
    const contributions = {};
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    events.forEach(event => {
        if (event.type === 'PushEvent' || event.type === 'CreateEvent' || event.type === 'PullRequestEvent') {
            const date = new Date(event.created_at);
            if (date >= oneYearAgo) {
                const dateKey = date.toISOString().split('T')[0];
                contributions[dateKey] = (contributions[dateKey] || 0) + 1;
            }
        }
    });

    // Add some sample data for demo purposes if no real contributions found
    if (Object.keys(contributions).length === 0) {
        console.log('No recent contributions found, adding sample data');
        const today = new Date();
        const sampleDates = [];
        
        // Add some random sample contributions over the past few months
        for (let i = 0; i < 30; i++) {
            const randomDaysAgo = Math.floor(Math.random() * 120); // Random day in past 4 months
            const sampleDate = new Date(today);
            sampleDate.setDate(today.getDate() - randomDaysAgo);
            const dateKey = sampleDate.toISOString().split('T')[0];
            contributions[dateKey] = Math.floor(Math.random() * 5) + 1; // 1-5 contributions
        }
    }

    return contributions;
}

// Generate the contribution calendar HTML
function generateContributionCalendar(contributions) {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(today.getDate() + 1); // Start from tomorrow last year

    let calendar = '';
    let totalContributions = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Generate 53 weeks (371 days)
    for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(oneYearAgo);
            currentDate.setDate(oneYearAgo.getDate() + (week * 7) + day);

            if (currentDate > today) break;

            const dateKey = currentDate.toISOString().split('T')[0];
            const count = contributions[dateKey] || 0;
            const level = getContributionLevel(count);

            totalContributions += count;

            // Calculate streaks
            if (count > 0) {
                tempStreak++;
                currentStreak = tempStreak;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 0;
            }

            const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = currentDate.getDate();
            const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });

            calendar += `<div class="calendar-day" 
                            data-level="${level}" 
                            data-date="${dateKey}"
                            data-count="${count}"
                            data-tooltip="${count} contribution${count !== 1 ? 's' : ''} on ${dayName}, ${monthName} ${monthDay}"></div>`;
        }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
        calendar,
        stats: {
            totalContributions,
            longestStreak
        }
    };
}

// Get contribution level (0-4) based on count
function getContributionLevel(count) {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
}

// Generate month labels for the calendar
function generateMonthLabels() {
    const months = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
        months.push(`<div class="calendar-month">${date.toLocaleDateString('en-US', { month: 'short' })}</div>`);
    }
    
    return months.join('');
}

// Add hover effects and tooltips to contribution calendar
function addContributionHoverEffects() {
    const tooltip = document.querySelector('.contribution-tooltip');
    const calendarDays = document.querySelectorAll('.calendar-day');

    calendarDays.forEach(day => {
        // Mouse events for desktop
        day.addEventListener('mouseenter', (e) => {
            showTooltip(e, tooltip);
        });

        day.addEventListener('mouseleave', () => {
            hideTooltip(tooltip);
        });

        // Touch events for mobile
        day.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            showTooltip(e, tooltip);
            
            // Hide tooltip after 2 seconds on mobile
            setTimeout(() => {
                hideTooltip(tooltip);
            }, 2000);
        });

        // Click events for mobile accessibility
        day.addEventListener('click', (e) => {
            e.preventDefault();
            showTooltip(e, tooltip);
            
            // Hide other tooltips and show this one
            setTimeout(() => {
                hideTooltip(tooltip);
            }, 3000);
        });
    });

    // Hide tooltip when touching outside on mobile
    document.addEventListener('touchstart', (e) => {
        if (!e.target.classList.contains('calendar-day')) {
            hideTooltip(tooltip);
        }
    });
}

// Helper function to show tooltip
function showTooltip(e, tooltip) {
    const tooltipText = e.target.getAttribute('data-tooltip');
    if (tooltip && tooltipText) {
        tooltip.textContent = tooltipText;
        tooltip.classList.add('show');
        
        const rect = e.target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Position tooltip and ensure it stays within viewport
        let left = rect.left + scrollLeft + rect.width / 2;
        let top = rect.top + scrollTop - 40;
        
        // Adjust for mobile screens
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            top = rect.top + scrollTop - 35;
            // Ensure tooltip doesn't go off screen horizontally
            const tooltipWidth = 200; // Approximate tooltip width
            if (left + tooltipWidth / 2 > window.innerWidth) {
                left = window.innerWidth - tooltipWidth / 2 - 10;
            }
            if (left - tooltipWidth / 2 < 10) {
                left = tooltipWidth / 2 + 10;
            }
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = 'translateX(-50%)';
    }
}

// Helper function to hide tooltip
function hideTooltip(tooltip) {
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

// Display fallback when contribution data can't be loaded
function displayContributionFallback() {
    const contributionGraph = document.getElementById('contribution-graph');
    if (!contributionGraph) return;

    console.log('Displaying contribution fallback');

    contributionGraph.innerHTML = `
        <div class="contribution-fallback">
            <div class="contribution-error-icon">📊</div>
            <div class="contribution-fallback-text">
                <p><strong>Contribution graph temporarily unavailable</strong></p>
                <p>Unable to load GitHub activity data at the moment.</p>
                <p>View my full contribution history on <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" class="contribution-link">GitHub</a></p>
            </div>
        </div>
    `;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const startTime = performance.now();
    console.log('DOM loaded, initializing website');
    
    // Always display manual languages immediately (no API dependency)
    displayManualLanguages();
    
    // Initialize hello text cycling
    console.log('Initializing hello text cycling');
    setTimeout(() => {
        cycleHelloText();
    }, 500); // Start hello text animation earlier
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Log performance metrics
    setTimeout(() => {
        const loadTime = performance.now() - startTime;
        console.log(`Website initialization completed in ${loadTime.toFixed(2)}ms`);
    }, 100);
    
    // Try to load GitHub data with progressive loading strategy
    const githubTimeout = 2000; // 2 second timeout for better UX
    
    // Load profile data first (highest priority)
    Promise.race([
        fetchGitHubProfile(),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('GitHub API timeout')), githubTimeout)
        )
    ]).catch(error => {
        console.log('GitHub profile fetch failed or timed out, using fallback:', error.message);
        setFallbackProfile();
    });
    
    // Load repos data with delay for better performance
    setTimeout(() => {
        Promise.race([
            fetchGitHubRepos(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('GitHub API timeout')), githubTimeout)
            )
        ]).catch(error => {
            console.log('GitHub repos fetch failed or timed out:', error.message);
            // Fallback repos are handled within the fetchGitHubRepos function
        });
    }, 200);
    
    // Load contributions data with longer delay (lowest priority)
    setTimeout(() => {
        Promise.race([
            fetchGitHubContributions(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('GitHub API timeout')), githubTimeout)
            )
        ]).catch(error => {
            console.log('GitHub contributions fetch failed or timed out:', error.message);
            // Fallback is handled within the fetchGitHubContributions function
        });
    }, 500);
    
    // Add smooth scrolling to all anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate counters when visible
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number && !target.classList.contains('animated')) {
                    target.classList.add('animated');
                    animateCounter(target, number);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
});
