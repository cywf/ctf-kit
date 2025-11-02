#!/usr/bin/env node

import { writeFile, mkdir, readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface ScriptInfo {
  path: string;
  name: string;
  description: string;
}

async function scanScripts(): Promise<ScriptInfo[]> {
  console.log('Scanning scripts directory...');

  const scriptsPath = join(process.cwd(), '..', 'scripts');
  const scripts: ScriptInfo[] = [];

  try {
    const entries = await readdir(scriptsPath, { recursive: true, withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile()) {
        const filePath = join(entry.parentPath || (entry as any).path || '', entry.name);
        const relativePath = filePath.replace(scriptsPath, '').replace(/^\//, '');
        
        // Try to extract description from file header
        let description = '';
        try {
          const content = await readFile(filePath, 'utf-8');
          
          // Look for comment blocks at the start of the file
          const lines = content.split('\n').slice(0, 20); // First 20 lines
          
          // Python style comments
          if (entry.name.endsWith('.py')) {
            const docstring = content.match(/"""([\s\S]*?)"""/);
            if (docstring) {
              const docText = docstring[1];
              if (typeof docText === 'string') {
                const lines = docText.trim().split('\n');
                if (lines.length > 0 && lines[0]) {
                  description = lines[0];
                }
              }
            }
            if (!description) {
              const comment = lines.find(line => line.trim().startsWith('#') && line.length > 2);
              if (comment) {
                description = comment.replace(/^#\s*/, '').trim();
              }
            }
          }
          
          // Shell/Bash comments
          else if (entry.name.endsWith('.sh')) {
            const comment = lines.find(line => line.trim().startsWith('#') && line.length > 2 && !line.includes('#!/'));
            if (comment) {
              description = comment.replace(/^#\s*/, '').trim();
            }
          }
          
          // JavaScript/TypeScript comments
          else if (entry.name.endsWith('.js') || entry.name.endsWith('.ts')) {
            const blockComment = content.match(/\/\*\*([\s\S]*?)\*\//);
            if (blockComment) {
              const commentText = blockComment[1];
              if (typeof commentText === 'string') {
                const processedLines = commentText.replace(/\*/g, '').trim().split('\n');
                if (processedLines.length > 0 && processedLines[0]) {
                  description = processedLines[0].trim();
                }
              }
            }
            if (!description) {
              const comment = lines.find(line => line.trim().startsWith('//') && line.length > 3);
              if (comment) {
                description = comment.replace(/^\/\/\s*/, '').trim();
              }
            }
          }
          
          if (!description) {
            description = `Script: ${entry.name}`;
          }
        } catch (err) {
          description = `Script: ${entry.name}`;
        }

        scripts.push({
          path: relativePath,
          name: entry.name,
          description,
        });
      }
    }

    console.log(`✓ Found ${scripts.length} scripts`);
    return scripts;
  } catch (error) {
    console.warn('Scripts directory not found or empty:', error);
    return [];
  }
}

async function main() {
  try {
    const scripts = await scanScripts();
    
    // Ensure directory exists
    const dataDir = join(process.cwd(), 'public', 'data');
    await mkdir(dataDir, { recursive: true });
    
    // Write to file
    const outputPath = join(dataDir, 'scripts.json');
    await writeFile(outputPath, JSON.stringify(scripts, null, 2));
    
    console.log(`✓ Scripts index written to ${outputPath}`);
  } catch (error) {
    console.error('Error scanning scripts:', error);
    
    // Write empty array as fallback
    const dataDir = join(process.cwd(), 'public', 'data');
    await mkdir(dataDir, { recursive: true });
    const outputPath = join(dataDir, 'scripts.json');
    await writeFile(outputPath, JSON.stringify([], null, 2));
    
    console.log('✓ Wrote empty scripts array');
  }
}

main();
