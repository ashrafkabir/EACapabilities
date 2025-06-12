import { db } from './db';
import { dataObjects, applications } from '@shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

// Manual mapping for known applications that don't match exactly
const manualMappings: Record<string, string> = {
  'Veeva - CTMS': 'CTMS Request Management',
  'Veeva - eTMF (Track)': 'GPS-Veeva-Safety Document Management System',
  'Veeva - QMOD': 'IOPS Veeva Vault QMS',
  'RAVE EDC': 'Medidata Rave',
  'LinkedIn Recruiter': 'LinkedIn',
  'Maven Clinic Platform': 'Maven',
  'Tempus Resource': 'Tempus',
  'Sparc-Amplify': 'Sparc',
  'MUFG Global Payment Hub': 'MUFG',
  'Veeva Medical CRM Global': 'Veeva CRM',
  'EY Global Tax Platform 1.0': 'EY Global Tax Platform',
  'ODR (CST Dashboard)': 'Dash'
};

// Enhanced fuzzy matching with manual mappings
function enhancedMatch(csvAppName: string, dbApplications: any[]): string | null {
  const trimmedName = csvAppName.trim();
  
  // First check manual mappings
  if (manualMappings[trimmedName]) {
    const mappedName = manualMappings[trimmedName];
    const foundApp = dbApplications.find(app => app.name === mappedName);
    if (foundApp) {
      return mappedName;
    }
  }
  
  // Then try fuzzy matching
  return findBestFuzzyMatch(trimmedName, dbApplications);
}

function findBestFuzzyMatch(applicationName: string, allApplications: any[]): string | null {
  if (!applicationName || applicationName.trim() === '') return null;
  
  const normalized = normalizeForMatching(applicationName);
  let bestMatch = null;
  let bestScore = 0.5;
  
  for (const app of allApplications) {
    const appNormalized = normalizeForMatching(app.name);
    const score = calculateSimilarity(normalized, appNormalized);
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = app.name;
    }
  }
  
  return bestMatch;
}

function normalizeForMatching(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(str1: string, str2: string): number {
  // Exact match
  if (str1 === str2) return 1.0;
  
  // Contains match
  if (str1.includes(str2) || str2.includes(str1)) return 0.9;
  
  // Word overlap
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word) && word.length > 2);
  
  if (commonWords.length > 0) {
    const overlap = (commonWords.length * 2) / (words1.length + words2.length);
    if (overlap > 0.4) return 0.8;
  }
  
  // Levenshtein similarity
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 0;
  
  const distance = levenshteinDistance(str1, str2);
  return 1 - (distance / maxLen);
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

async function parseCSV(filePath: string): Promise<any[]> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length < 3) return [];
  
  const dataLines = lines.slice(2);
  
  return dataLines.map(line => {
    const fields = parseCSVLine(line);
    return {
      id: fields[0]?.replace(/['"]/g, ''),
      name: fields[2]?.replace(/['"]/g, ''),
      relDataObjectToApplication: fields[15]?.replace(/['"]/g, '')
    };
  });
}

async function enhancedMapDataObjects() {
  console.log('Starting enhanced data object to application mapping...');
  
  const allApplications = await db.select().from(applications);
  console.log(`Loaded ${allApplications.length} applications from database`);
  
  const csvPath = path.join(process.cwd(), 'attached_assets', 'DataObjects_1749518164787.csv');
  const dataObjectsFromCSV = await parseCSV(csvPath);
  console.log(`Parsed ${dataObjectsFromCSV.length} data objects from CSV`);
  
  let mappedCount = 0;
  let unmappedCount = 0;
  const results: any[] = [];
  
  for (const dataObj of dataObjectsFromCSV) {
    if (!dataObj.relDataObjectToApplication) {
      unmappedCount++;
      continue;
    }
    
    const applicationNames = dataObj.relDataObjectToApplication
      .split(';')
      .map((name: string) => name.trim())
      .filter((name: string) => name !== '');
    
    const mappedApplications: string[] = [];
    
    for (const appName of applicationNames) {
      const match = enhancedMatch(appName, allApplications);
      if (match) {
        mappedApplications.push(match);
        console.log(`✓ Mapped "${appName}" -> "${match}"`);
      } else {
        console.log(`✗ No match for "${appName}"`);
      }
    }
    
    if (mappedApplications.length > 0) {
      mappedCount++;
      
      const mappedString = mappedApplications.join(';');
      
      try {
        await db
          .update(dataObjects)
          .set({ relDataObjectToApplication: mappedString })
          .where(eq(dataObjects.id, dataObj.id));
        
        results.push({
          dataObjectName: dataObj.name,
          originalApplications: dataObj.relDataObjectToApplication,
          mappedApplications: mappedString,
          mappingCount: mappedApplications.length
        });
        
      } catch (error) {
        console.error(`Error updating ${dataObj.name}:`, error);
      }
    } else {
      unmappedCount++;
    }
  }
  
  console.log('\n=== Enhanced Mapping Results ===');
  console.log(`Total data objects: ${dataObjectsFromCSV.length}`);
  console.log(`Successfully mapped: ${mappedCount}`);
  console.log(`Unmapped: ${unmappedCount}`);
  console.log(`Total application mappings: ${results.reduce((sum, r) => sum + r.mappingCount, 0)}`);
  
  fs.writeFileSync('enhanced-mapping-results.json', JSON.stringify(results, null, 2));
  console.log('\nDetailed results saved to enhanced-mapping-results.json');
  
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  enhancedMapDataObjects()
    .then(() => {
      console.log('\nEnhanced mapping completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Mapping failed:', error);
      process.exit(1);
    });
}

export { enhancedMapDataObjects };