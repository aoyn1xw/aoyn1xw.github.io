import React, { useEffect, useState } from 'react'

const GITHUB_USERNAME = 'aoyn1xw'
const API_BASE = 'https://api.github.com'

// Social Icons Component with interactive bubbles
function SocialIcons() {
  const socialLinks = [
    { 
      name: 'Email', 
      url: `mailto:hello@aoyn1xw.me`, 
      icon: '/assets/logos/mail.svg'
    },
    { 
      name: 'Instagram', 
      url: 'https://instagram.com/aoyn1xw', 
      icon: '/assets/logos/instagram.svg'
    },
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/aoyn1xw', 
      icon: '/assets/logos/linkedin.svg'
    },
    { 
      name: 'TikTok', 
      url: 'https://tiktok.com/@aoyn1xw', 
      icon: '/assets/logos/tiktok.svg'
    },
    { 
      name: 'GitHub', 
      url: `https://github.com/${GITHUB_USERNAME}`, 
      icon: '/assets/logos/github.svg'
    },
    { 
      name: 'GitHub New', 
      url: `https://github.com/${GITHUB_USERNAME}`, 
      icon: '/assets/logos/github-new.svg'
    }
  ];

  return (
    <div className="social-grid">
      {socialLinks.map((social, index) => (
        <a 
          key={index}
          href={social.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label={social.name} 
          title={social.name} 
          className="social-bubble"
        >
          <img src={social.icon} alt={social.name} width="30" height="30" />
        </a>
      ))}
    </div>
  )
}

function FeaturedProjects({ repos }){
  // Get most starred repos as featured
  const featuredRepos = repos
    .filter(repo => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  if (featuredRepos.length === 0) {
    return (
      <section className="section">
        <h2>Featured Projects</h2>
        <div className="projects-grid">
          <div className="card project-card">
            <div className="project-placeholder">
              <div className="placeholder-icon">🚀</div>
              <div className="card-body">
                <h3>Coming Soon</h3>
                <p className="muted">Exciting projects are on the way!</p>
                <div className="card-actions">
                  <button className="btn" disabled>View Project</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {featuredRepos.map(repo => (
          <div key={repo.id} className="card project-card">
            <div className="project-image">
              {repo.language && <span className="language-tag">{repo.language}</span>}
            </div>
            <div className="card-body">
              <h3>{repo.name}</h3>
              <p className="muted">{repo.description || 'No description available'}</p>
              <div className="project-stats">
                <span>⭐ {repo.stargazers_count}</span>
                <span>🍴 {repo.forks_count}</span>
              </div>
              <div className="card-actions">
                <a 
                  className="btn" 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Skills(){
  const skills = [
    { name: 'HTML', level: 90 },
    { name: 'CSS', level: 85 },
    { name: 'JavaScript', level: 80 },
    { name: 'React', level: 75 },
    { name: 'TypeScript', level: 70 },
    { name: 'APIs', level: 85 }
  ];

  return (
    <section className="section">
      <h2>Skills</h2>
      <div className="skills-container">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item">
            <div className="skill-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">{skill.level}%</span>
            </div>
            <div className="skill-bar">
              <div 
                className="skill-progress" 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function App(){
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [githubContribData, setGithubContribData] = useState([])

  // Effect to fetch GitHub data
  useEffect(() => {
    async function fetchGitHub(){
      try {
        setLoading(true);
        
        // Fetch user profile from GitHub API (per sketch instruction)
        const profileRes = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}`);
        
        if (!profileRes.ok) {
          throw new Error(`HTTP error! status: ${profileRes.status}`);
        }
        
        const profileData = await profileRes.json();
        setProfile(profileData);
        
        // Fetch contribution data (public API, no token). Falls back to local generator if it fails.
        try {
          const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
          if (contribRes.ok) {
            const contribJson = await contribRes.json();
            // API returns { years: [{ total, range: { start, end }, contributions: [{date,count,level}] }] }
            const latestYear = Array.isArray(contribJson?.years) && contribJson.years[0];
            const days = (latestYear?.contributions || []).map(d => ({
              date: d.date,
              level: Math.max(0, Math.min(4, d.level || 0)),
              count: d.count || 0
            }));
            // Keep last 35 days to resemble the sketch box size
            setGithubContribData(days.slice(-35));
          } else {
            setGithubContribData(generateGithubGrid().map(level => ({ level })));
          }
        } catch {
          setGithubContribData(generateGithubGrid().map(level => ({ level })));
        }

        // Fetch repositories data
        const reposRes = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        
        if (!reposRes.ok) {
          throw new Error(`HTTP error! status: ${reposRes.status}`);
        }
        
        const reposData = await reposRes.json();
        setRepos(reposData);
      } catch(e) {
        console.error('GitHub fetch error', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGitHub();
    // No global listeners needed; we attach interactivity inline where needed.
    return () => {};
  }, [])

  // Create interactive bubbles effect
  const createBubble = (e, element) => {
    const bubble = document.createElement('div');
    bubble.className = 'interactive-bubble';
    
    // Set position and size based on the element
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${e.clientX - rect.left - size/2}px`;
    bubble.style.top = `${e.clientY - rect.top - size/2}px`;
    
    // Add to element
    element.appendChild(bubble);
    
    // Remove after animation
    setTimeout(() => {
      bubble.remove();
    }, 2000);
  };
  
  // Reference for GitHub contribution grid
  const generateGithubGrid = () => {
    const days = [];
    const contributionLevels = [0, 1, 2, 3, 4]; // 0 is empty, 1-4 are levels of contribution
    
    // Generate a 7x5 grid (week days x 5 weeks)
    for (let i = 0; i < 35; i++) {
      // Randomly choose contribution level
      const level = contributionLevels[Math.floor(Math.random() * contributionLevels.length)];
      days.push(level);
    }
    
    return days;
  };
  
  const githubContributions = githubContribData.length
    ? githubContribData.map(d => d.level)
    : generateGithubGrid();
  
  // ASCII art for the ASCII section
  const asciiArt = 
`
    _    ____ _   _ _   _ _  _   ____        ____ _ _   _           _     
   / \\  / ___| \\ | | \\ | | || |  |_ _|_ __  / ___(_) |_| |__  _   _| |__  
  / _ \\| |   |  \\| |  \\| | || |_  | || '_ \\| |  _| | __| '_ \\| | | | '_ \\ 
 / ___ \\ |___| |\\  | |\\  |__   _| | || | | | |_| | | |_| | | | |_| | |_) |
/_/   \\_\\____|_| \\_|_| \\_|  |_| |___|_| |_|\\____|_|\\__|_| |_|\\__,_|_.__/ 
                                                                         
`;

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <p>Error loading profile: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <div className="site-name">aoyn1xw</div>
        <nav>
          <ul>
            <li><a href="#about">About Me</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Social or Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="profile-section" id="about">
        <div 
          className="profile-pic" 
          onMouseMove={(e) => createBubble(e, e.currentTarget)}
        >
          <img 
            src={profile?.avatar_url || '/assets/picture/placeholder.svg'} 
            alt={profile?.name || 'Profile'} 
            onError={(e) => {
              e.target.src = '/assets/picture/placeholder.svg';
            }}
          />
        </div>
        <div className="profile-description">
          <h2>Short description of what I do or like</h2>
          <p>
            {profile?.bio || 'I build random stuff on the internet. This is a placeholder for my bio that will be fetched from the GitHub API as mentioned in the sketch.'}
          </p>
        </div>
      </section>

      <div className="main-content">
        {/* Skills Section */}
        <section className="skills-section" id="skills">
          <h2>Knows</h2>
          <ul className="skills-list">
            <li>HTML/CSS/JS</li>
            <li>React/Node</li>
            <li>Python</li>
            <li>Linux/Bash</li>
          </ul>
        </section>

        {/* Learning Section */}
        <section className="learning-section">
          <h2>Learning</h2>
          <ul className="learning-list">
            <li>Prompt/AI</li>
            <li>AWS</li>
          </ul>
        </section>

        {/* Social Section */}
        <section className="social-section" id="contact">
          <h2>Social / Contact</h2>
          <SocialIcons />
        </section>

        {/* Interests Section */}
        <section className="interests-section">
          <h2>Interests</h2>
          <ul className="interests-list">
            <li>Interest 1</li>
            <li>Interest 2</li>
            <li>Interest 3</li>
            <li>Interest 4</li>
          </ul>
        </section>

        {/* Promo Section */}
        <section className="promo-section">
          <h2>Promos/referrals</h2>
          <ul className="promo-list">
            <li><a href="https://example.com">https://example.com</a></li>
            <li><a href="https://example.com">https://example.com</a></li>
            <li><a href="https://example.com">https://example.com</a></li>
          </ul>
        </section>

        {/* GitHub Contribution Grid Section */}
        <section className="github-section" id="projects">
          <h2>GitHub contribute grid</h2>
          <div className="github-grid">
            {githubContributions.map((level, index) => (
              <div 
                key={index} 
                className={`github-day contribution-${level}`}
                title={typeof level === 'number' ? `${level} contributions` : 'Contributions'}
              ></div>
            ))}
          </div>
        </section>

        {/* ASCII Art Section */}
        <section className="ascii-section">
          <h2>ASCII Art or something</h2>
          <div className="ascii-art">
            {asciiArt}
          </div>
        </section>
      </div>
    </div>
  )
}
