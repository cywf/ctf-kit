#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'ctf-kit';

interface Discussion {
  title: string;
  author: string;
  url: string;
  createdAt: string;
  category: string;
}

async function fetchGraphQL(query: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'CTF-Kit-Site',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });
  
  if (!response.ok) {
    throw new Error(`GitHub GraphQL error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchDiscussions(): Promise<Discussion[]> {
  console.log('Fetching discussions...');

  const query = `
    query {
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        discussions(first: 25, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            title
            url
            createdAt
            author {
              login
            }
            category {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const result = await fetchGraphQL(query);
    
    if (result.errors) {
      console.warn('GraphQL errors:', result.errors);
    }
    
    const discussions: Discussion[] = result.data?.repository?.discussions?.nodes?.map((node: any) => ({
      title: node.title,
      author: node.author?.login || 'Unknown',
      url: node.url,
      createdAt: node.createdAt,
      category: node.category?.name || 'General',
    })) || [];

    console.log(`✓ Fetched ${discussions.length} discussions`);
    return discussions;
  } catch (error) {
    console.warn('Failed to fetch discussions:', error);
    return [];
  }
}

async function main() {
  try {
    const discussions = await fetchDiscussions();
    
    // Ensure directory exists
    const dataDir = join(process.cwd(), 'public', 'data');
    await mkdir(dataDir, { recursive: true });
    
    // Write to file
    const outputPath = join(dataDir, 'discussions.json');
    await writeFile(outputPath, JSON.stringify(discussions, null, 2));
    
    console.log(`✓ Discussions written to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    
    // Write empty array as fallback
    const dataDir = join(process.cwd(), 'public', 'data');
    await mkdir(dataDir, { recursive: true });
    const outputPath = join(dataDir, 'discussions.json');
    await writeFile(outputPath, JSON.stringify([], null, 2));
    
    console.log('✓ Wrote empty discussions array');
  }
}

main();
