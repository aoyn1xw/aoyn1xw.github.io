import React, { useEffect, useState } from 'react'

const GITHUB_USERNAME = 'aoyn1xw'
const API_BASE = 'https://api.github.com'

function SocialIcons({ profile }){
  const socialLinks = [
    { 
      name: 'Email', 
      url: `mailto:${profile?.email || 'hello@ayon1xw.me'}`, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25c-.25-.16-.4-.43-.4-.72 0-.67.73-1.07 1.3-.72L12 11l6.7-4.19c.57-.35 1.3.05 1.3.72 0 .29-.15.56-.4.72z" fill="currentColor" />
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      url: 'https://instagram.com/ayon1xw', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor" />
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/your-slug', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="currentColor" />
        </svg>
      )
    },
    { 
      name: 'TikTok', 
      url: 'https://tiktok.com/@ayon1xw', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="currentColor" />
        </svg>
      )
    },
    { 
      name: 'GitHub', 
      url: `https://github.com/${GITHUB_USERNAME}`, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor" />
        </svg>
      )
    }
  ];

  return (
    <div className="social-row">
      {socialLinks.map((social, index) => (
        <a 
          key={index}
          href={social.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label={social.name} 
          title={social.name} 
          className="social-box"
        >
          {social.icon}
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
  const [dark, setDark] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    async function fetchGitHub(){
      try{
        setLoading(true);
        const pRes = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}`)
        
        if (!pRes.ok) {
          throw new Error(`HTTP error! status: ${pRes.status}`);
        }
        
        const p = await pRes.json()
        setProfile(p)

        const rRes = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
        
        if (!rRes.ok) {
          throw new Error(`HTTP error! status: ${rRes.status}`);
        }
        
        const r = await rRes.json()
        setRepos(r)
      }catch(e){
        console.error('GitHub fetch error', e)
        setError(e.message)
      }finally{
        setLoading(false)
      }
    }
    fetchGitHub()
  },[])

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <p>Error loading profile: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>
      <div className="container">
        <header className="profile">
          <div className="avatar-wrap">
            {profile && (
              <img 
                className="avatar" 
                src={profile.avatar_url} 
                alt={profile.name || profile.login} 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            )}
          </div>
          <h1 className="name">{profile ? (profile.name || profile.login) : 'Loading...'}</h1>
          <p className="bio">{profile ? (profile.bio || 'Developer passionate about creating amazing web experiences') : 'Loading bio...'}</p>
          
          {profile && (
            <div className="profile-stats">
              <span>👥 {profile.followers} Followers</span>
              <span>⭐ {profile.public_repos} Repos</span>
            </div>
          )}

          <SocialIcons profile={profile} />
        </header>

        <main>
          <FeaturedProjects repos={repos} />
          <Skills />
        </main>

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="copyright">
              © {new Date().getFullYear()} {profile?.name || profile?.login || 'Developer'} | All rights reserved
            </div>
            <div className="sponsor-button">
              <iframe 
                src={`https://github.com/sponsors/${GITHUB_USERNAME}/button`} 
                title={`Sponsor ${GITHUB_USERNAME}`} 
                height="32" 
                width="114" 
                style={{ border: 0, borderRadius: '6px' }}
              ></iframe>
            </div>
          </div>
        </footer>

        <button 
          className="dark-toggle" 
          onClick={() => setDark(d => !d)} 
          aria-label="Toggle dark mode"
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </div>
  )
}
