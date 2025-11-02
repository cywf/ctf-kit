#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'ctf-kit';

interface ProjectItem {
  title: string;
  status: string;
  url: string;
  labels: string[];
  assignees: string[];
}

interface ProjectData {
  name: string;
  items: ProjectItem[];
}

async function fetchGitHub(path: string) {
  const url = `https://api.github.com${path}`;
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

async function fetchProjectsV2(): Promise<ProjectData | null> {
  console.log('Attempting to fetch Projects v2...');

  const query = `
    query {
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        projectsV2(first: 1) {
          nodes {
            title
            items(first: 100) {
              nodes {
                content {
                  ... on Issue {
                    title
                    url
                    labels(first: 10) {
                      nodes {
                        name
                      }
                    }
                    assignees(first: 5) {
                      nodes {
                        login
                      }
                    }
                  }
                }
                fieldValues(first: 10) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                    }
                  }
                }
              }
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
      return null;
    }
    
    const project = result.data?.repository?.projectsV2?.nodes?.[0];
    if (!project) {
      console.log('No Projects v2 found');
      return null;
    }

    const items: ProjectItem[] = project.items.nodes
      .filter((item: any) => item.content)
      .map((item: any) => {
        const status = item.fieldValues?.nodes?.find((field: any) => field.name)?.name || 'Todo';
        return {
          title: item.content.title,
          status,
          url: item.content.url,
          labels: item.content.labels?.nodes?.map((label: any) => label.name) || [],
          assignees: item.content.assignees?.nodes?.map((assignee: any) => assignee.login) || [],
        };
      });

    console.log(`✓ Fetched Projects v2 with ${items.length} items`);
    return {
      name: project.title,
      items,
    };
  } catch (error) {
    console.warn('Failed to fetch Projects v2:', error);
    return null;
  }
}

async function fetchIssuesFallback(): Promise<ProjectData> {
  console.log('Using issues fallback...');

  const issues = await fetchGitHub(`/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=all&per_page=100`);

  const items: ProjectItem[] = issues.map((issue: any) => {
    // Determine status from labels
    let status = 'Todo';
    const labelNames = issue.labels.map((label: any) => label.name);
    
    if (labelNames.some((name: string) => name.toLowerCase().includes('done') || name.toLowerCase().includes('completed'))) {
      status = 'Done';
    } else if (labelNames.some((name: string) => name.toLowerCase().includes('doing') || name.toLowerCase().includes('progress'))) {
      status = 'In Progress';
    }

    return {
      title: issue.title,
      status,
      url: issue.html_url,
      labels: labelNames,
      assignees: issue.assignees?.map((assignee: any) => assignee.login) || [],
    };
  });

  console.log(`✓ Fetched ${items.length} issues as fallback`);
  return {
    name: 'Issues (Fallback)',
    items,
  };
}

async function main() {
  try {
    // Try Projects v2 first
    let projectData = await fetchProjectsV2();
    
    // Fallback to issues if Projects v2 not available
    if (!projectData) {
      projectData = await fetchIssuesFallback();
    }
    
    // Ensure directory exists
    const dataDir = join(process.cwd(), 'public', 'data');
    await mkdir(dataDir, { recursive: true });
    
    // Write to file
    const outputPath = join(dataDir, 'projects.json');
    await writeFile(outputPath, JSON.stringify(projectData, null, 2));
    
    console.log(`✓ Project data written to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching project data:', error);
    
    // Write empty fallback data
    const fallbackData: ProjectData = {
      name: 'Project Board',
      items: [],
    };
    
    const dataDir = join(process.cwd(), 'public', 'data');
    await mkdir(dataDir, { recursive: true });
    const outputPath = join(dataDir, 'projects.json');
    await writeFile(outputPath, JSON.stringify(fallbackData, null, 2));
    
    console.log('✓ Wrote fallback project data');
  }
}

main();
