import { useState, useEffect } from 'react';
import { githubService, GitHubUser, GitHubRepo } from '../services/github';

export function useGitHubUser() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const userData = await githubService.getUser();
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch GitHub user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}

export function useGitHubRepositories() {
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true);
        const repos = await githubService.getFeaturedRepositories();
        setRepositories(repos);
      } catch (err) {
        setError('Failed to fetch GitHub repositories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  return { repositories, loading, error };
}

export function useGitHubLanguages() {
  const [languages, setLanguages] = useState<{ name: string; count: number; percentage: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        setLoading(true);
        const languageData = await githubService.getTopLanguages();
        setLanguages(languageData);
      } catch (err) {
        setError('Failed to fetch GitHub language data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLanguages();
  }, []);

  return { languages, loading, error };
}