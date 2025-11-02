#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'ctf-kit';

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  languages: Record<string, number>;
  commitActivity: Array<{ week: string; commits: number }>;
}

async function fetchGitHub(path: string) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${path}`;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'CTF-Kit-Site',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchRepoData(): Promise<RepoStats> {
  console.log('Fetching repository data...');

  // Fetch repo info
  const repoInfo = await fetchGitHub('');
  
  // Fetch languages
  const languages = await fetchGitHub('/languages');
  
  // Fetch commit activity
  const commitActivity = await fetchGitHub('/stats/commit_activity');
  
  // Process commit activity for last 12 weeks
  const last12Weeks = commitActivity.slice(-12).map((week: any) => ({
    week: new Date(week.week * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    commits: week.total,
  }));

  const stats: RepoStats = {
    stars: repoInfo.stargazers_count || 0,
    forks: repoInfo.forks_count || 0,
    watchers: repoInfo.watchers_count || 0,
    languages,
    commitActivity: last12Weeks,
  };

  console.log(`Stats: ${stats.stars} stars, ${stats.forks} forks, ${stats.watchers} watchers`);
  
  return stats;
}

async function main() {
  try {
    const stats = await fetchRepoData();
    
    // Ensure directory exists
    const dataDir = join(process.cwd(), 'public', 'data');
    await mkdir(dataDir, { recursive: true });
    
    // Write to file
    const outputPath = join(dataDir, 'stats.json');
    await writeFile(outputPath, JSON.stringify(stats, null, 2));
    
    console.log(`✓ Repository stats written to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching repository data:', error);
    
    // Write empty fallback data
    const fallbackStats: RepoStats = {
      stars: 0,
      forks: 0,
      watchers: 0,
      languages: {},
      commitActivity: [],
    };
    
    const dataDir = join(process.cwd(), 'public', 'data');
    await mkdir(dataDir, { recursive: true });
    const outputPath = join(dataDir, 'stats.json');
    await writeFile(outputPath, JSON.stringify(fallbackStats, null, 2));
    
    console.log('✓ Wrote fallback stats data');
  }
}

main();
