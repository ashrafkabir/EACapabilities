import { db } from './db';
import { businessCapabilities } from '@shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

async function importMissingCapabilities() {
  console.log('Starting import of missing business capabilities...');
  
  // Parse the CSV file
  const csvPath = path.join(process.cwd(), 'attached_assets', 'BusinessCapabilities_mapping_1749518164788.csv');
  const mappingData = await parseCSV(csvPath);
  console.log(`Parsed ${mappingData.length} capability mappings from CSV`);
  
  // Get all existing capabilities from database
  const existingCapabilities = await db.select().from(businessCapabilities);
  const existingNames = new Set(existingCapabilities.map(cap => cap.name));
  console.log(`Found ${existingCapabilities.length} existing capabilities in database`);
  
  // Filter to only missing capabilities
  const missingCapabilities = mappingData.filter(mapping => 
    mapping.originalName && 
    mapping.lifesciencesPath && 
    !existingNames.has(mapping.originalName)
  );
  
  console.log(`Found ${missingCapabilities.length} missing capabilities to import`);
  
  let importedCount = 0;
  let errorCount = 0;
  const results: any[] = [];
  
  for (const mapping of missingCapabilities) {
    const levels = parseLifesciencesPath(mapping.lifesciencesPath);
    
    try {
      const newCapability = {
        id: uuidv4(),
        name: mapping.originalName,
        description: `Business capability: ${mapping.originalName}`,
        level1: levels.level1,
        level2: levels.level2,
        level3: levels.level3,
        level: levels.level3 ? 3 : levels.level2 ? 2 : 1,
        parentId: null, // Will be set in a second pass
        domain: levels.level1 || 'General',
        criticality: 'Medium',
        maturity: 'Developing',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.insert(businessCapabilities).values(newCapability);
      
      importedCount++;
      results.push({
        name: mapping.originalName,
        level1: levels.level1,
        level2: levels.level2,
        level3: levels.level3,
        level: newCapability.level,
        lifesciencesPath: mapping.lifesciencesPath
      });
      
      console.log(`✓ Imported: ${mapping.originalName} (L${newCapability.level}: ${levels.level1}/${levels.level2}/${levels.level3})`);
      
    } catch (error) {
      errorCount++;
      console.error(`✗ Error importing ${mapping.originalName}:`, error);
    }
  }
  
  console.log('\n=== Import Results ===');
  console.log(`Total missing capabilities: ${missingCapabilities.length}`);
  console.log(`Successfully imported: ${importedCount}`);
  console.log(`Errors: ${errorCount}`);
  
  // Show summary by level
  const levelCounts = results.reduce((acc, item) => {
    acc[item.level] = (acc[item.level] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  console.log('\nImported capabilities by level:');
  console.log(`Level 1: ${levelCounts[1] || 0} capabilities`);
  console.log(`Level 2: ${levelCounts[2] || 0} capabilities`);
  console.log(`Level 3: ${levelCounts[3] || 0} capabilities`);
  
  // Save detailed results
  fs.writeFileSync('imported-capabilities-results.json', JSON.stringify(results, null, 2));
  console.log('\nDetailed results saved to imported-capabilities-results.json');
  
  return results;
}

async function updateParentRelationships() {
  console.log('\nUpdating parent-child relationships...');
  
  const allCapabilities = await db.select().from(businessCapabilities);
  let updatedRelationships = 0;
  
  for (const capability of allCapabilities) {
    if (capability.level === 3 && capability.level2) {
      // Find parent capability at level 2
      const parent = allCapabilities.find(cap => 
        cap.level === 2 && 
        cap.level1 === capability.level1 && 
        cap.level2 === capability.level2 &&
        cap.name !== capability.name
      );
      
      if (parent && capability.parentId !== parent.id) {
        await db
          .update(businessCapabilities)
          .set({ parentId: parent.id })
          .where(eq(businessCapabilities.id, capability.id));
        
        updatedRelationships++;
        console.log(`✓ Set parent: ${capability.name} -> ${parent.name}`);
      }
    } else if (capability.level === 2 && capability.level1) {
      // Find parent capability at level 1
      const parent = allCapabilities.find(cap => 
        cap.level === 1 && 
        cap.level1 === capability.level1 &&
        cap.name !== capability.name
      );
      
      if (parent && capability.parentId !== parent.id) {
        await db
          .update(businessCapabilities)
          .set({ parentId: parent.id })
          .where(eq(businessCapabilities.id, capability.id));
        
        updatedRelationships++;
        console.log(`✓ Set parent: ${capability.name} -> ${parent.name}`);
      }
    }
  }
  
  console.log(`Updated ${updatedRelationships} parent-child relationships`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  importMissingCapabilities()
    .then(() => updateParentRelationships())
    .then(() => {
      console.log('\nMissing capabilities import completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

export { importMissingCapabilities };