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

// Fetch GitHub languages data
async function fetchGitHubLanguages() {
    try {
        console.log('Fetching GitHub languages...');
        
        // First, get all repositories
        const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100`);
        
        if (!reposResponse.ok) {
            throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
        }
        
        const repos = await reposResponse.json();
        console.log(`Found ${repos.length} repositories`);
        
        // Collect language data from all repositories
        const languageStats = {};
        let totalBytes = 0;

        // Fetch language data for each repository
        const languagePromises = repos.map(async (repo) => {
            try {
                const langResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/languages`);
                if (langResponse.ok) {
                    const languages = await langResponse.json();
                    
                    // Add up bytes for each language
                    for (const [language, bytes] of Object.entries(languages)) {
                        languageStats[language] = (languageStats[language] || 0) + bytes;
                        totalBytes += bytes;
                    }
                }
            } catch (error) {
                console.log(`Error fetching languages for ${repo.name}:`, error);
            }
        });

        await Promise.all(languagePromises);
        console.log('Language stats:', languageStats);

        // Calculate percentages and sort by usage
        const languageArray = Object.entries(languageStats)
            .map(([language, bytes]) => ({
                name: language,
                bytes: bytes,
                percentage: ((bytes / totalBytes) * 100).toFixed(1)
            }))
            .sort((a, b) => b.bytes - a.bytes)
            .slice(0, 6); // Show top 6 languages

        const languagesGrid = document.getElementById('languages-grid');
        
        if (languageArray.length === 0) {
            // Fallback with common languages if no data found
            const fallbackLanguages = [
                { name: 'JavaScript', percentage: '35.2' },
                { name: 'HTML', percentage: '28.1' },
                { name: 'CSS', percentage: '21.5' },
                { name: 'Python', percentage: '8.7' },
                { name: 'TypeScript', percentage: '4.9' },
                { name: 'Shell', percentage: '1.6' }
            ];
            
            languagesGrid.classList.remove('loading');
            
            const fallbackHTML = fallbackLanguages.map((lang, index) => {
                const icon = languageIcons[lang.name] || languageIcons.default;
                const color = languageColors[lang.name] || '#858585';
                
                return `
                    <div class="language-item" style="animation-delay: ${index * 0.1}s;">
                        <div class="language-icon">${icon}</div>
                        <div class="language-info">
                            <span class="language-name">${lang.name}</span>
                            <div class="language-percentage">${lang.percentage}%</div>
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
            
            languagesGrid.innerHTML = fallbackHTML + fallbackHTML;
            
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
            
            return;
        }

        // Remove loading class
        languagesGrid.classList.remove('loading');

        // Create language items HTML
        const languageItemsHTML = languageArray.map((lang, index) => {
            const icon = languageIcons[lang.name] || languageIcons.default;
            const color = languageColors[lang.name] || '#858585';
            
            return `
                <div class="language-item" style="animation-delay: ${index * 0.1}s;">
                    <div class="language-icon">${icon}</div>
                    <div class="language-info">
                        <span class="language-name">${lang.name}</span>
                        <div class="language-percentage">${lang.percentage}%</div>
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

        // Create duplicated content for infinite scroll
        languagesGrid.innerHTML = languageItemsHTML + languageItemsHTML;

        // Trigger animations after a short delay
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.languages-grid .progress-fill');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    const targetWidth = bar.getAttribute('data-percentage');
                    bar.style.width = `${targetWidth}%`;
                }, index * 200);
            });
        }, 300);    } catch (error) {
        console.error('Error fetching GitHub languages:', error);
        const languagesGrid = document.getElementById('languages-grid');
        languagesGrid.classList.add('loading');
        languagesGrid.innerHTML = `
            <div class="language-item">
                <div class="language-icon">❌</div>
                <div class="language-info">
                    <span class="language-name">Unable to load language data</span>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 8px;">
                        Visit my <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">GitHub profile</a> to see my repositories.
                    </p>
                </div>
            </div>
        `;
    }
}

// Fetch GitHub profile data
async function fetchGitHubProfile() {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        const profile = await response.json();
        
        const profileCard = document.getElementById('github-profile');
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
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        document.getElementById('github-profile').innerHTML = `
            <p style="color: var(--text-secondary); text-align: center;">
                Unable to load GitHub profile. Visit my 
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">GitHub page</a> directly.
            </p>
        `;
    }
}

// Fetch GitHub repositories
async function fetchGitHubRepos() {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        const reposContainer = document.getElementById('github-repos');
        
        if (repos.length === 0) {
            reposContainer.innerHTML = `
                <div class="repo-card">
                    <p style="text-align: center; color: var(--text-secondary);">
                        No repositories found. Visit my 
                        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">GitHub profile</a>.
                    </p>
                </div>
            `;
            return;
        }

        reposContainer.innerHTML = repos.map(repo => {
            const languageColor = languageColors[repo.language] || '#858585';
            const updatedDate = new Date(repo.updated_at).toLocaleDateString();
            
            return `
                <div class="repo-card dynamic">
                    <div class="repo-header">
                        <h4 class="repo-name">${repo.name}</h4>
                        ${repo.language ? `
                            <span class="repo-language">
                                <span class="language-dot" style="background-color: ${languageColor};"></span>
                                ${repo.language}
                            </span>
                        ` : '<span class="repo-language">Code</span>'}
                    </div>
                    <p class="repo-description">
                        ${repo.description || 'No description available for this repository.'}
                    </p>
                    ${repo.topics && repo.topics.length > 0 ? `
                        <div class="repo-topics">
                            ${repo.topics.slice(0, 3).map(topic => `
                                <span class="repo-topic">${topic}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="repo-stats">
                        <span class="repo-stat">⭐ ${repo.stargazers_count}</span>
                        <span class="repo-stat">🍴 ${repo.forks_count}</span>
                        ${repo.language ? `<span class="repo-stat">💻 ${repo.language}</span>` : ''}
                    </div>
                    <div class="repo-updated">Updated on ${updatedDate}</div>
                    <a href="${repo.html_url}" target="_blank" class="repo-link">View Repository</a>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        document.getElementById('github-repos').innerHTML = `
            <div class="repo-card">
                <h4 style="color: var(--text); margin-bottom: 16px;">Unable to load repositories</h4>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    There was an issue loading my GitHub repositories. You can visit my profile directly to see all my projects.
                </p>
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="repo-link">
                    Visit GitHub Profile
                </a>
            </div>
        `;
    }
}

// Initialize GitHub data loading
document.addEventListener('DOMContentLoaded', function() {
    fetchGitHubProfile();
    fetchGitHubRepos();
    
    // Initialize manual language progress bars
    initializeLanguageProgressBars();
    
    // Add pause on hover for language carousel
    const languagesGrid = document.getElementById('languages-grid');
    if (languagesGrid) {
        languagesGrid.addEventListener('mouseenter', () => {
            languagesGrid.style.animationPlayState = 'paused';
        });
        languagesGrid.addEventListener('mouseleave', () => {
            languagesGrid.style.animationPlayState = 'running';
        });
    }
    
    // Add typing effect to main title
    const title = document.querySelector('header h1');
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid var(--primary)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                title.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    setTimeout(typeWriter, 1000);
    
    // Add counter animation to stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('+', ''));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                }
            }, 40);
        });
    };
    
    // Trigger counter animation when stats are visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }
    
    // Custom cursor tracking
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Enhanced hover effects
    document.querySelectorAll('a, .social-icon, .repo-card, .language-item, .stat-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'radial-gradient(circle, var(--accent) 0%, transparent 70%)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, var(--primary) 0%, transparent 70%)';
        });
    });
});

// Add scroll-triggered animations for progress bars
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress-fill');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.style.width || '0%';
                }, index * 200);
            });
        }
    });
}, observerOptions);

// Observe the languages section
document.addEventListener('DOMContentLoaded', function() {
    const languagesSection = document.querySelector('.languages-section');
    if (languagesSection) {
        progressObserver.observe(languagesSection);
    }
});
