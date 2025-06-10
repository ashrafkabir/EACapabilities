import { db } from './db';
import { itComponents, initiatives } from '@shared/schema';
import fs from 'fs';

function parseCSVLine(line: string): string[] {
  const result = [];
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

async function importITComponentsBatch() {
  try {
    const fileContent = fs.readFileSync('./attached_assets/ITComponents_1749518164787.csv', 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    const headers = parseCSVLine(lines[0]);
    const dataRows = lines.slice(2); // Skip both header rows
    
    console.log(`Processing ${dataRows.length} IT components in batches...`);
    
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < dataRows.length; i += batchSize) {
      const batch = dataRows.slice(i, i + batchSize);
      const components = [];
      
      for (const line of batch) {
        const values = parseCSVLine(line);
        const record: any = {};
        
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        
        if (!record.id || !record.name) continue;
        
        components.push({
          name: record.name || '',
          displayName: record.displayName || record.name || '',
          category: record.relITComponentToTechnologyStack || '',
          vendor: record.relITComponentToProvider || '',
          version: '',
          status: 'active',
          applications: record.relITComponentToApplication || '',
        });
      }
      
      if (components.length > 0) {
        await db.insert(itComponents).values(components).onConflictDoNothing();
        imported += components.length;
        console.log(`Imported ${imported} IT components so far...`);
      }
    }
    
    console.log(`IT components import completed - ${imported} records`);
  } catch (error) {
    console.error('Error importing IT components:', error);
  }
}

async function importInitiativesBatch() {
  try {
    const fileContent = fs.readFileSync('./attached_assets/Initiatives_1749518164787.csv', 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    const headers = parseCSVLine(lines[0]);
    const dataRows = lines.slice(2); // Skip both header rows
    
    console.log(`Processing ${dataRows.length} initiatives in batches...`);
    
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < dataRows.length; i += batchSize) {
      const batch = dataRows.slice(i, i + batchSize);
      const initiativesList = [];
      
      for (const line of batch) {
        const values = parseCSVLine(line);
        const record: any = {};
        
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        
        if (!record.id || !record.name) continue;
        
        initiativesList.push({
          name: record.name || '',
          description: record.displayName || null,
          status: record['tags:Project Phase'] || 'active',
          startDate: null,
          endDate: null,
          businessCapabilities: record.relProjectToBusinessCapability || null,
          applications: record.relProjectToApplication || null,
        });
      }
      
      if (initiativesList.length > 0) {
        await db.insert(initiatives).values(initiativesList).onConflictDoNothing();
        imported += initiativesList.length;
        console.log(`Imported ${imported} initiatives so far...`);
      }
    }
    
    console.log(`Initiatives import completed - ${imported} records`);
  } catch (error) {
    console.error('Error importing initiatives:', error);
  }
}

async function main() {
  try {
    console.log('Starting direct SQL import...');
    await importITComponentsBatch();
    await importInitiativesBatch();
    console.log('Direct SQL import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Direct SQL import failed:', error);
    process.exit(1);
  }
}

main();