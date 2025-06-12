import { db } from './db';
import { dataObjects, applications } from '@shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

// Simple fuzzy matching function
function fuzzyMatch(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check if one string contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Calculate Levenshtein distance ratio
  const maxLength = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  const similarity = 1 - (distance / maxLength);
  
  return similarity;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + substitutionCost // substitution
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
  
  // Skip the first 2 lines (header and description)
  const dataLines = lines.slice(2);
  
  return dataLines.map(line => {
    const fields = parseCSVLine(line);
    return {
      id: fields[0]?.replace(/['"]/g, ''),
      type: fields[1]?.replace(/['"]/g, ''),
      name: fields[2]?.replace(/['"]/g, ''),
      displayName: fields[3]?.replace(/['"]/g, ''),
      relDataObjectToInterface: fields[4]?.replace(/['"]/g, ''),
      relDataObjectToProject: fields[5]?.replace(/['"]/g, ''),
      tagsGdItTeams: fields[6]?.replace(/['"]/g, ''),
      tagsOwnedBy: fields[7]?.replace(/['"]/g, ''),
      tagsOwningFunction: fields[8]?.replace(/['"]/g, ''),
      tagsBusinessDomain: fields[9]?.replace(/['"]/g, ''),
      tagsMainArea: fields[10]?.replace(/['"]/g, ''),
      tagsBusinessUnit: fields[11]?.replace(/['"]/g, ''),
      tagsLxPsWiP: fields[12]?.replace(/['"]/g, ''),
      tagsRegion: fields[13]?.replace(/['"]/g, ''),
      tagsOtherTags: fields[14]?.replace(/['"]/g, ''),
      relDataObjectToApplication: fields[15]?.replace(/['"]/g, ''),
      relToChild: fields[16]?.replace(/['"]/g, '')
    };
  });
}

async function findBestApplicationMatch(applicationName: string, allApplications: any[]): Promise<string | null> {
  if (!applicationName || applicationName.trim() === '') return null;
  
  let bestMatch = null;
  let bestScore = 0.6; // Minimum threshold for matching
  
  for (const app of allApplications) {
    const score = fuzzyMatch(applicationName, app.name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = app.name;
    }
  }
  
  return bestMatch;
}

async function mapDataObjectsToApplications() {
  console.log('Starting data object to application mapping...');
  
  // Load all applications from database
  const allApplications = await db.select().from(applications);
  console.log(`Loaded ${allApplications.length} applications from database`);
  
  // Parse the CSV file
  const csvPath = path.join(process.cwd(), 'attached_assets', 'DataObjects_1749518164787.csv');
  const dataObjectsFromCSV = await parseCSV(csvPath);
  console.log(`Parsed ${dataObjectsFromCSV.length} data objects from CSV`);
  
  let mappedCount = 0;
  let unmappedCount = 0;
  const mappingResults: any[] = [];
  
  for (const dataObj of dataObjectsFromCSV) {
    if (!dataObj.relDataObjectToApplication) {
      unmappedCount++;
      continue;
    }
    
    // Split semicolon-separated application names
    const applicationNames = dataObj.relDataObjectToApplication
      .split(';')
      .map((name: string) => name.trim())
      .filter((name: string) => name !== '');
    
    const mappedApplications: string[] = [];
    
    for (const appName of applicationNames) {
      const bestMatch = await findBestApplicationMatch(appName, allApplications);
      if (bestMatch) {
        mappedApplications.push(bestMatch);
        console.log(`Mapped "${appName}" -> "${bestMatch}"`);
      } else {
        console.log(`No match found for application: "${appName}"`);
      }
    }
    
    if (mappedApplications.length > 0) {
      mappedCount++;
      
      // Update the data object in the database
      const mappedApplicationString = mappedApplications.join(';');
      
      try {
        await db
          .update(dataObjects)
          .set({ 
            relDataObjectToApplication: mappedApplicationString
          })
          .where(eq(dataObjects.id, dataObj.id));
        
        mappingResults.push({
          dataObjectName: dataObj.name,
          originalApplications: dataObj.relDataObjectToApplication,
          mappedApplications: mappedApplicationString
        });
        
      } catch (error) {
        console.error(`Error updating data object ${dataObj.name}:`, error);
      }
    } else {
      unmappedCount++;
    }
  }
  
  console.log('\n=== Mapping Summary ===');
  console.log(`Total data objects processed: ${dataObjectsFromCSV.length}`);
  console.log(`Successfully mapped: ${mappedCount}`);
  console.log(`Unmapped (no applications or no matches): ${unmappedCount}`);
  
  // Save mapping results to file for review
  fs.writeFileSync(
    'dataobject-application-mappings.json', 
    JSON.stringify(mappingResults, null, 2)
  );
  console.log('\nMapping results saved to dataobject-application-mappings.json');
  
  return mappingResults;
}

// Run the mapping
if (import.meta.url === `file://${process.argv[1]}`) {
  mapDataObjectsToApplications()
    .then((results) => {
      console.log('\nMapping completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error during mapping:', error);
      process.exit(1);
    });
}

export { mapDataObjectsToApplications };