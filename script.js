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
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const repos = await response.json();

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

// Fetch GitHub profile data
async function fetchGitHubProfile() {
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Try to load GitHub data with timeout fallbacks
    const githubTimeout = 5000; // 5 second timeout
    
    // Attempt to fetch GitHub profile with timeout
    Promise.race([
        fetchGitHubProfile(),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('GitHub API timeout')), githubTimeout)
        )
    ]).catch(error => {
        console.log('GitHub profile fetch failed or timed out, using fallback:', error.message);
        setFallbackProfile();
    });
    
    // Attempt to fetch GitHub repos with timeout
    Promise.race([
        fetchGitHubRepos(),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('GitHub API timeout')), githubTimeout)
        )
    ]).catch(error => {
        console.log('GitHub repos fetch failed or timed out:', error.message);
        // Fallback repos are handled within the fetchGitHubRepos function
    });
    
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
