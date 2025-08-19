// GitHub API configuration
const GITHUB_USERNAME = 'aoyn1xw';
const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string;
  blog: string;
  company: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
  private: boolean;
}

export interface LanguageStats {
  [language: string]: number;
}

class GitHubService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`GitHub API error: ${response.status} ${response.statusText}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('GitHub API fetch error:', error);
      return null;
    }
  }

  async getUser(): Promise<GitHubUser | null> {
    return this.fetchWithErrorHandling<GitHubUser>(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
  }

  async getRepositories(): Promise<GitHubRepo[]> {
    const repos = await this.fetchWithErrorHandling<GitHubRepo[]>(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    );
    
    if (!repos) return [];
    
    // Filter out forks and archived repos, sort by stars and recent activity
    return repos
      .filter(repo => !repo.fork && !repo.archived && !repo.private)
      .sort((a, b) => {
        // Sort by stars first, then by updated date
        const starDiff = b.stargazers_count - a.stargazers_count;
        if (starDiff !== 0) return starDiff;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }

  async getLanguageStats(): Promise<LanguageStats> {
    const repos = await this.getRepositories();
    const languageStats: LanguageStats = {};
    
    // Get language data for each repository
    for (const repo of repos.slice(0, 20)) { // Limit to top 20 repos to avoid rate limiting
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    }
    
    return languageStats;
  }

  async getTopLanguages(limit: number = 8): Promise<{ name: string; count: number; percentage: number }[]> {
    const languageStats = await this.getLanguageStats();
    const total = Object.values(languageStats).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(languageStats)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async getFeaturedRepositories(limit: number = 6): Promise<GitHubRepo[]> {
    const repos = await this.getRepositories();
    return repos.slice(0, limit);
  }
}

export const githubService = new GitHubService();