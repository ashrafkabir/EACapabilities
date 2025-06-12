import { db } from './db';
import { businessCapabilities } from '@shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

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
  
  if (lines.length < 2) return [];
  
  const dataLines = lines.slice(1); // Skip header
  
  return dataLines.map(line => {
    const fields = parseCSVLine(line);
    return {
      originalName: fields[0]?.replace(/['"]/g, ''),
      hierarchy: fields[1]?.replace(/['"]/g, ''),
      mappedLevel1: fields[2]?.replace(/['"]/g, ''),
      lifesciencesPath: fields[3]?.replace(/['"]/g, '')
    };
  });
}

function parseLifesciencesPath(path: string): { level1: string; level2: string; level3: string } {
  const parts = path.split(' / ').map(p => p.trim());
  
  return {
    level1: parts[0] || '',
    level2: parts[1] || '',
    level3: parts[2] || ''
  };
}

async function reprocessBusinessCapabilities() {
  console.log('Starting business capabilities reprocessing...');
  
  // Parse the CSV file
  const csvPath = path.join(process.cwd(), 'attached_assets', 'BusinessCapabilities_mapping_1749518164788.csv');
  const mappingData = await parseCSV(csvPath);
  console.log(`Parsed ${mappingData.length} capability mappings from CSV`);
  
  // Get all existing capabilities from database
  const existingCapabilities = await db.select().from(businessCapabilities);
  console.log(`Found ${existingCapabilities.length} existing capabilities in database`);
  
  let updatedCount = 0;
  let notFoundCount = 0;
  const results: any[] = [];
  
  for (const mapping of mappingData) {
    if (!mapping.lifesciencesPath) {
      console.log(`⚠ No lifesciences path for: ${mapping.originalName}`);
      continue;
    }
    
    // Parse the lifesciences path into level1, level2, level3
    const levels = parseLifesciencesPath(mapping.lifesciencesPath);
    
    // Find matching capability in database by name
    const existingCapability = existingCapabilities.find(cap => 
      cap.name === mapping.originalName || 
      cap.name === mapping.originalName.trim()
    );
    
    if (existingCapability) {
      try {
        // Update the capability with new level information
        await db
          .update(businessCapabilities)
          .set({
            level1: levels.level1,
            level2: levels.level2,
            level3: levels.level3,
            // Update level based on which levels are populated
            level: levels.level3 ? 3 : levels.level2 ? 2 : 1
          })
          .where(eq(businessCapabilities.id, existingCapability.id));
        
        updatedCount++;
        
        results.push({
          id: existingCapability.id,
          name: mapping.originalName,
          oldLevel1: existingCapability.level1,
          oldLevel2: existingCapability.level2,
          oldLevel3: existingCapability.level3,
          oldLevel: existingCapability.level,
          newLevel1: levels.level1,
          newLevel2: levels.level2,
          newLevel3: levels.level3,
          newLevel: levels.level3 ? 3 : levels.level2 ? 2 : 1,
          lifesciencesPath: mapping.lifesciencesPath
        });
        
        console.log(`✓ Updated: ${mapping.originalName} -> L1: ${levels.level1}, L2: ${levels.level2}, L3: ${levels.level3}`);
        
      } catch (error) {
        console.error(`✗ Error updating ${mapping.originalName}:`, error);
      }
    } else {
      notFoundCount++;
      console.log(`✗ Not found in database: ${mapping.originalName}`);
    }
  }
  
  console.log('\n=== Reprocessing Results ===');
  console.log(`Total mappings processed: ${mappingData.length}`);
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Not found in database: ${notFoundCount}`);
  
  // Save detailed results
  fs.writeFileSync('capability-reprocessing-results.json', JSON.stringify(results, null, 2));
  console.log('\nDetailed results saved to capability-reprocessing-results.json');
  
  // Show summary of level distribution
  const levelCounts = results.reduce((acc, item) => {
    acc[item.newLevel] = (acc[item.newLevel] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  console.log('\nLevel distribution after update:');
  console.log(`Level 1: ${levelCounts[1] || 0} capabilities`);
  console.log(`Level 2: ${levelCounts[2] || 0} capabilities`);
  console.log(`Level 3: ${levelCounts[3] || 0} capabilities`);
  
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  reprocessBusinessCapabilities()
    .then(() => {
      console.log('\nBusiness capabilities reprocessing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Reprocessing failed:', error);
      process.exit(1);
    });
}

export { reprocessBusinessCapabilities };