// =============================================================================
// VIDEO AUTOPLAY FIX FOR iOS
// =============================================================================

function forceVideoPlay() {
    const video = document.getElementById('hero-video');
    if (video) {
        video.muted = true;
        video.playsInline = true;

        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented, attempting to play on user interaction');

                // Try to play on first user interaction
                const playOnInteraction = () => {
                    video.play().catch(err => console.log('Video play failed:', err));
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('click', playOnInteraction);
                };

                document.addEventListener('touchstart', playOnInteraction, { once: true });
                document.addEventListener('click', playOnInteraction, { once: true });
            });
        }
    }
}

// =============================================================================
// GITHUB API INTEGRATION
// =============================================================================

const FEATURED_REPOS = [
    'aoyn1xw/swift-devcontainer',
    'aoyn1xw/ipa-signer',
    'aoyn1xw/Untis-watcher'
];

// Fallback data in case API fails or rate limit is hit
const FALLBACK_DATA = {
    'aoyn1xw/swift-devcontainer': {
        name: 'swift-devcontainer',
        description: 'Development container configuration for Swift projects with pre-configured tooling and dependencies.',
        html_url: 'https://github.com/aoyn1xw/swift-devcontainer',
        homepage: null,
        language: 'Dockerfile',
        stargazers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        contributors: 1
    },
    'aoyn1xw/ipa-signer': {
        name: 'ipa-signer',
        description: 'Tool for signing iOS IPA files with custom certificates and provisioning profiles.',
        html_url: 'https://github.com/aoyn1xw/ipa-signer',
        homepage: null,
        language: 'Python',
        stargazers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        contributors: 1
    },
    'aoyn1xw/Untis-watcher': {
        name: 'Untis-watcher',
        description: 'Automated monitoring tool for Untis schedule changes with notification support.',
        html_url: 'https://github.com/aoyn1xw/Untis-watcher',
        homepage: null,
        language: 'Python',
        stargazers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        contributors: 1
    }
};

// =============================================================================
// FETCH REPOSITORY DATA
// =============================================================================

async function fetchRepoData(repo) {
    try {
        const [owner, repoName] = repo.split('/');

        // Fetch basic repo info
        const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!repoResponse.ok) {
            throw new Error(`GitHub API returned ${repoResponse.status}`);
        }

        const repoData = await repoResponse.json();

        // Fetch contributors count
        const contributorsResponse = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=1`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        let contributorsCount = 1;
        if (contributorsResponse.ok) {
            const contributors = await contributorsResponse.json();
            const linkHeader = contributorsResponse.headers.get('Link');
            if (linkHeader) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                contributorsCount = match ? parseInt(match[1], 10) : contributors.length;
            } else {
                contributorsCount = contributors.length;
            }
        }

        return {
            name: repoData.name,
            description: repoData.description || 'No description available.',
            html_url: repoData.html_url,
            homepage: repoData.homepage,
            language: repoData.language || 'Unknown',
            stargazers_count: repoData.stargazers_count,
            forks_count: repoData.forks_count,
            open_issues_count: repoData.open_issues_count,
            contributors: contributorsCount
        };
    } catch (error) {
        console.warn(`Failed to fetch ${repo}, using fallback data:`, error);
        return FALLBACK_DATA[repo];
    }
}

// =============================================================================
// RENDER PROJECT CARD
// =============================================================================

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';

    const hasDemo = repo.homepage && repo.homepage.trim() !== '';

    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${repo.name}</h3>
        </div>
        <p class="project-description">${repo.description}</p>
        <div class="project-meta">
            <span class="project-tag">
                <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                </svg>
                ${repo.language}
            </span>
            <div class="project-stats">
                <span class="stat" title="Stars">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    ${repo.stargazers_count}
                </span>
                <span class="stat" title="Forks">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="18" r="3"/>
                        <circle cx="6" cy="6" r="3"/>
                        <circle cx="18" cy="6" r="3"/>
                        <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/>
                        <path d="M12 12v3"/>
                    </svg>
                    ${repo.forks_count}
                </span>
                <span class="stat" title="Open Issues">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="1"/>
                    </svg>
                    ${repo.open_issues_count}
                </span>
                <span class="stat" title="Contributors">
                    <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    ${repo.contributors}
                </span>
            </div>
        </div>
        <div class="project-actions">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
            </a>
            ${hasDemo ? `
                <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Demo
                </a>
            ` : ''}
        </div>
    `;

    return card;
}

// =============================================================================
// LOAD AND RENDER PROJECTS
// =============================================================================

async function loadProjects() {
    const grid = document.getElementById('projects-grid');

    try {
        // Fetch all repos in parallel
        const repoDataPromises = FEATURED_REPOS.map(repo => fetchRepoData(repo));
        const reposData = await Promise.all(repoDataPromises);

        // Clear skeleton
        grid.innerHTML = '';

        // Render cards with staggered animation
        reposData.forEach((repo, index) => {
            const card = createProjectCard(repo);
            card.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to load projects:', error);

        // Fallback: render all fallback data
        grid.innerHTML = '';
        FEATURED_REPOS.forEach((repoName, index) => {
            const repo = FALLBACK_DATA[repoName];
            const card = createProjectCard(repo);
            card.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(card);
        });
    }
}

// =============================================================================
// SMOOTH SCROLL OBSERVER
// =============================================================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'hero') {
            observer.observe(section);
        }
    });
}

// =============================================================================
// INITIALIZE ON LOAD
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    forceVideoPlay();
    loadProjects();
    initScrollAnimations();
});

// Additional video play attempt after page fully loads
window.addEventListener('load', () => {
    forceVideoPlay();
});
